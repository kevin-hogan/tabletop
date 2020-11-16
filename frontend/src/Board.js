import React from "react";
import "./Board.css";
import bard_picture from "./images/bard.png";
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
      pieceToCoordinates: { bard: { row: 0, col: 0 } },
      selected: false,
    };
  }

  componentDidMount() {
    this.socket.on(
      "gameState",
      function (gameState) {
        console.log(gameState);
        this.setState({ pieceToCoordinates: gameState });
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

  resizeImgAndSetVisible = (e) => {
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
    if (this.state.selected) {
      e.target.focus();
    }
  };

  selectAvatar = (e) => {
    this.setState({ selected: true });
    e.target.style.border = "solid";
    e.target.style.borderColor = "blue";
    e.target.style.borderRadius = "100%";
  };

  unselectAvatar = (e) => {
    this.setState({ selected: false });
    e.target.style.border = "";
    e.target.style.borderColor = "";
    e.target.style.borderRadius = "";
  };

  moveAvatarWithKeys = (e) => {
    e.preventDefault();
    e.target.focus();
    const curRow = this.state.pieceToCoordinates["bard"]["row"];
    const curCol = this.state.pieceToCoordinates["bard"]["col"];
    let newState = null;
    switch (e.key) {
      case "KeyS":
      case "ArrowDown":
        newState = {
          bard: {
            row: Math.min(curRow + 1, this.state.numRows - 1),
            col: curCol,
          },
        };
        break;
      case "KeyW":
      case "ArrowUp":
        newState = { bard: { row: Math.max(curRow - 1, 0), col: curCol } };
        break;
      case "KeyA":
      case "ArrowLeft":
        newState = { bard: { row: curRow, col: Math.max(curCol - 1, 0) } };
        break;
      case "KeyD":
      case "ArrowRight":
        newState = {
          bard: {
            row: curRow,
            col: Math.min(curCol + 1, this.state.numCols - 1),
          },
        };
        break;
      default:
    }

    if (newState != null) {
      this.setState({
        pieceToCoordinates: newState,
      });
      this.socket.emit("updateGameState", newState);
    }
  };

  render() {
    const avatar = (
      <img
        alt="A bard token"
        id="bardPicture"
        style={{margin: "auto"}}
        tabIndex={0}
        src={bard_picture}
        draggable={true}
        // ondragstart="drag(event)"
        onLoad={this.resizeImgAndSetVisible}
        hidden={true}
        onKeyDown={this.moveAvatarWithKeys}
        onFocus={this.selectAvatar}
        onBlur={this.unselectAvatar}
      ></img>
    );

    const avatarCoords = this.state.pieceToCoordinates["bard"];
    const avatarIndex =
      avatarCoords["row"] * this.state.numCols + avatarCoords["col"];

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
              <div key={i} style={{ display: "flex" }}>
                {i === avatarIndex ? avatar : null}
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}

export default Board;
