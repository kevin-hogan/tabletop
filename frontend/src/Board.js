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
      pieceToCoordinates: {},
      selected: {},
      boardColors: {},
    };
  }

  componentDidMount() {
    this.socket.on(
      "playerPositions",
      function (playerPositions) {
        this.setState({ pieceToCoordinates: playerPositions });
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

  resizeImgAndSetVisible = (e, imageKey) => {
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
    if (this.state.selected[imageKey]) {
      e.target.focus();
    }
  };

  selectAvatar = (e, imageKey) => {
    const newSelected = {...this.state.selected}
    newSelected[imageKey] = true;
    this.setState({ selected: newSelected });
    e.target.style.border = "solid";
    e.target.style.borderColor = "blue";
    e.target.style.borderRadius = "100%";
  };

  unselectAvatar = (e, imageKey) => {
    const newSelected = {...this.state.selected}
    newSelected[imageKey] = false;
    this.setState({ selected: newSelected });
    e.target.style.border = "";
    e.target.style.borderColor = "";
    e.target.style.borderRadius = "";
  };

  moveAvatarWithKeys = (e, imageKey) => {
    e.preventDefault();
    e.target.focus();
    const curRow = this.state.pieceToCoordinates[imageKey]["row"];
    const curCol = this.state.pieceToCoordinates[imageKey]["col"];
    let newPositions = {};
    switch (e.key) {
      case "KeyS":
      case "ArrowDown":
        newPositions[imageKey] = {
          row: Math.min(curRow + 1, this.state.numRows - 1),
          col: curCol,
        };
        break;
      case "KeyW":
      case "ArrowUp":
        newPositions[imageKey] = { row: Math.max(curRow - 1, 0), col: curCol };
        break;
      case "KeyA":
      case "ArrowLeft":
        newPositions[imageKey] = { row: curRow, col: Math.max(curCol - 1, 0) };
        break;
      case "KeyD":
      case "ArrowRight":
        newPositions[imageKey] = {
          row: curRow,
          col: Math.min(curCol + 1, this.state.numCols - 1),
        };
        break;
      default:
    }

    if (newPositions !== {}) {
      this.setState({
        pieceToCoordinates: {...this.state.pieceToCoordinates, ...newPositions},
      });
      this.socket.emit("updatePlayerPositions", newPositions);
    }
  };

  handleCellClick = (cellIndex) => {
    if (this.props.drawingColor !== "") {
      const newBoardColors = { ...this.state.boardColors };
      newBoardColors[cellIndex] = this.props.drawingColor;
      this.setState({ boardColors: newBoardColors });
      this.socket.emit("updateBoardColors", newBoardColors);
    } else if (this.props.selectedToken !== "") {
      const newPieceToCoordinates = { ...this.state.pieceToCoordinates };
      newPieceToCoordinates[this.props.selectedToken] = {
        row: Math.floor(cellIndex / this.state.numCols),
        col: cellIndex % this.state.numCols,
      };
      this.setState({ pieceToCoordinates: newPieceToCoordinates });
      this.socket.emit("updatePlayerPositions", newPieceToCoordinates);
    }
  };

  renderAvatar = (imageSrc) => {
    return (
      <img
        alt="A bard token"
        style={{ margin: "auto" }}
        tabIndex={0}
        src={imageSrc}
        draggable={true}
        // ondragstart="drag(event)"
        onLoad={(e) => this.resizeImgAndSetVisible(e, imageSrc)}
        hidden={true}
        onKeyDown={(e) => this.moveAvatarWithKeys(e, imageSrc)}
        onFocus={(e) => this.selectAvatar(e, imageSrc)}
        onBlur={(e) => this.unselectAvatar(e, imageSrc)}
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
                style={{
                  display: "flex",
                  backgroundColor: this.state.boardColors[i],
                }}
              >
                {Object.entries(this.state.pieceToCoordinates)
                  .filter(
                    ([_, { row, col }]) => row * this.state.numCols + col === i
                  )
                  .map(([imgUrl, _]) => this.renderAvatar(imgUrl))}
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}

export default Board;
