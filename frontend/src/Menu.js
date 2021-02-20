import React from "react";
import "./Menu.css";
import bard_picture from "./images/bard.png";
import cleric_picture from "./images/cleric.png";
import knight_picture from "./images/knight.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faPaintBrush } from "@fortawesome/free-solid-svg-icons";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container">
        <div className="dropdown" style={{ cursor: "pointer" }}>
          <FontAwesomeIcon
            style={{ fontSize: "60px", margin: "10px", cursor: "pointer" }}
            icon={faUserPlus}
          />
          <div className="dropdown-content">
            <a href="#" onClick={() => this.props.setSelectedToken({"imgUrl": bard_picture})}>
              Bard
            </a>
            <a href="#" onClick={() => this.props.setSelectedToken({"imgUrl": cleric_picture})}>
              Cleric
            </a>
            <a href="#" onClick={() => this.props.setSelectedToken({"imgUrl": knight_picture})}>
              Knight
            </a>
            <a href="#" onClick={() => this.props.setSelectedToken("")}>
              Done Adding Tokens
            </a>
          </div>
        </div>
        <div className="dropdown" style={{ cursor: "pointer" }}>
          <FontAwesomeIcon
            className="dropbtn"
            style={{ fontSize: "60px", margin: "10px", cursor: "pointer" }}
            icon={faPaintBrush}
          />
          <div className="dropdown-content">
            <a href="#" onClick={() => this.props.setDrawingColor("white")}>
              White
            </a>
            <a href="#" onClick={() => this.props.setDrawingColor("black")}>
              Black
            </a>
            <a href="#" onClick={() => this.props.setDrawingColor("blue")}>
              Blue
            </a>
            <a href="#" onClick={() => this.props.setDrawingColor("")}>
              Done Drawing
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
