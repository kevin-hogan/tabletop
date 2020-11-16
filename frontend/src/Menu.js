import React from "react";
import "./Menu.css";
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
        <FontAwesomeIcon
          style={{ fontSize: "60px", margin: "10px", cursor: "pointer" }}
          icon={faUserPlus}
        />
        <div class="dropdown" style={{cursor: "pointer"}}>
          <FontAwesomeIcon
            className="dropbtn"
            style={{ fontSize: "60px", margin: "10px", cursor: "pointer" }}
            icon={faPaintBrush}
          />
          <div class="dropdown-content">
            <a href="#" onClick={() => this.props.setDrawingColor("white")}>White</a>
            <a href="#" onClick={() => this.props.setDrawingColor("black")}>Black</a>
            <a href="#" onClick={() => this.props.setDrawingColor("blue")}>Blue</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
