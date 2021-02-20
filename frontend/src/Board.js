import React from "react";
import "./Board.css";
import io from "socket.io-client";

const BOARD_HEIGHT = 800;
const BOARD_WIDTH = 1500;

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io("http://localhost:5000");
    this.state = {
      socket: null,
      numRows: 13,
      numCols: 21,
      tokenIdToTokenData: {},
      selected: {},
      boardColors: {},
      dropTargetIndex: null
    };
  }

  componentDidMount() {
    this.socket.on(
      "playerPositions",
      function (playerPositions) {
        this.setState({ tokenIdToTokenData: playerPositions });
      }.bind(this)
    );
    this.socket.on(
      "boardColors",
      function (boardColors) {
        this.setState({ boardColors: boardColors });
      }.bind(this)
    );
  }

  calculateAspectRatioFit(originalWidth, originalHeight, maxWidth, maxHeight) {
    const ratio = Math.min(
      maxWidth / originalWidth,
      maxHeight / originalHeight
    );

    return { width: originalWidth * ratio, height: originalHeight * ratio };
  }

  resizeImgAndSetVisible = (e, token) => {
    const buffer = 7;
    const fit = this.calculateAspectRatioFit(
      e.target.width,
      e.target.height,
      BOARD_HEIGHT / this.state.numRows - buffer,
      BOARD_WIDTH / this.state.numCols - buffer
    );
    e.target.width = fit["width"];
    e.target.height = fit["height"];
    e.target.hidden = false;
    if (this.state.selected[token.id]) {
      e.target.focus();
    }
  };

  selectToken = (e, token) => {
    const newSelected = {...this.state.selected}
    newSelected[token.id] = true;
    this.setState({ selected: newSelected });
    e.target.style.border = "solid";
    e.target.style.borderColor = "blue";
    e.target.style.borderRadius = "100%";
  };

  unselectToken = (e, token) => {
    const newSelected = {...this.state.selected}
    newSelected[token.id] = false;
    this.setState({ selected: newSelected });
    e.target.style.border = "";
    e.target.style.borderColor = "";
    e.target.style.borderRadius = "";
  };

  updateTokenPosition = (token, row, col) => {
    const newTokenData = {...this.state.tokenIdToTokenData[token.id], row: row, col: col};
    const newTokenIdToTokenData = {...this.state.tokenIdToTokenData, ...{[token.id]: newTokenData}};
    this.setState({
      tokenIdToTokenData: newTokenIdToTokenData,
    });
    this.socket.emit("updatePlayerPositions", newTokenIdToTokenData);
  }

  moveTokenWithKeys = (e, token) => {
    e.preventDefault();
    e.target.focus();
    const curRow = this.state.tokenIdToTokenData[token.id]["row"];
    const curCol = this.state.tokenIdToTokenData[token.id]["col"];
    switch (e.key) {
      case "KeyS":
      case "ArrowDown":
        this.updateTokenPosition(token, Math.min(curRow + 1, this.state.numRows - 1), curCol);
        break;
      case "KeyW":
      case "ArrowUp":
        this.updateTokenPosition(token, Math.max(curRow - 1, 0), curCol);
        break;
      case "KeyA":
      case "ArrowLeft":
        this.updateTokenPosition(token, curRow, Math.max(curCol - 1, 0));
        break;
      case "KeyD":
      case "ArrowRight":
        this.updateTokenPosition(token, curRow, Math.min(curCol + 1, this.state.numCols - 1));
        break;
      default:
    }
  };

  addTokenToBoard = (token, cellIndex) => {
    const newTokenIdToTokenData = { ...this.state.tokenIdToTokenData };
    const newTokenId = Math.random()
    newTokenIdToTokenData[newTokenId] = {
      ...token,
      id: newTokenId,
      row: Math.floor(cellIndex / this.state.numCols),
      col: cellIndex % this.state.numCols,
    };
    this.setState({ tokenIdToTokenData: newTokenIdToTokenData });
    this.socket.emit("updatePlayerPositions", newTokenIdToTokenData);
  }

  removeTokenFromBoard = (token) => {
    const newTokenIdToTokenData = { ...this.state.tokenIdToTokenData };
    delete newTokenIdToTokenData[token.id];
    this.setState({ tokenIdToTokenData: newTokenIdToTokenData });
    this.socket.emit("updatePlayerPositions", newTokenIdToTokenData);
  }

  handleCellClick = (cellIndex) => {
    if (this.props.drawingColor !== "") {
      const newBoardColors = { ...this.state.boardColors };
      newBoardColors[cellIndex] = this.props.drawingColor;
      this.setState({ boardColors: newBoardColors });
      this.socket.emit("updateBoardColors", newBoardColors);
    } else if (this.props.selectedToken !== "") {
      this.addTokenToBoard(this.props.selectedToken, cellIndex);
    }
  };

  onTokenDrag = (e) => {
    e.target.style.display = "none";
  }

  onTokenDragEnd = (e, token) => {
    e.target.style.display = "";
    const i = this.state.dropTargetIndex;
    this.updateTokenPosition(token, Math.floor(i / this.state.numCols), i % this.state.numCols);
    this.selectToken(e, token);
  }

  renderToken = (token) => {
    return (
      <img
        key={token.id}
        alt="A character token"
        style={{ margin: "auto" }}
        tabIndex={0}
        src={token.imgUrl}
        draggable={true}
        onDrag={this.onTokenDrag}
        onDragEnd={(e) => this.onTokenDragEnd(e, token)}
        onLoad={(e) => this.resizeImgAndSetVisible(e, token)}
        hidden={true} // temporary until resizing
        onKeyDown={(e) => this.moveTokenWithKeys(e, token)}
        onFocus={(e) => this.selectToken(e, token)}
        onBlur={(e) => this.unselectToken(e, token)}
        onContextMenu={(e) => {e.preventDefault(); this.removeTokenFromBoard(token)}}
      ></img>
    );
  };

  render() {
    return (
      <div className="board">
        <div
          className="wrapper"
          style={{
            gridTemplateRows: "repeat(" + this.state.numRows + ", 1fr)",
            gridTemplateColumns: "repeat(" + this.state.numCols + ", 1fr)",
          }}
        >
          {[...Array(this.state.numCols * this.state.numRows).keys()].map(
            (i) => (
              <div
                key={i}
                onClick={() => this.handleCellClick(i)}
                onDragOver={(e) => {e.preventDefault();this.setState({dropTargetIndex: i})}}
                onDrop={(e) => e.preventDefault()}
                style={{
                  display: "flex",
                  backgroundColor: this.state.boardColors[i],
                }}
              >
                {Object.entries(this.state.tokenIdToTokenData)
                  .filter(
                    ([_, { row, col }]) => row * this.state.numCols + col === i
                  )
                  .map(([_, token]) => this.renderToken(token))}
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}

export default Board;
