import React from "react";
import "./Menu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faPaintBrush } from "@fortawesome/free-solid-svg-icons";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenSearchText: ""
    };
  }

  updateTokenSearchText = (e) => {
    this.setState({tokenSearchText: e.target.value});
  }

  render() {
    const r = require.context('./images', false, /\.png$/)
    const images = r.keys().map((item, _) => {
      return {name: item.replace('./', '').replace(".png", ""), url: r(item)}
    });

    return (
      <div className="container">
        <div className="dropdown" style={{ cursor: "pointer" }}>
          <FontAwesomeIcon
            style={{ fontSize: "60px", margin: "10px", cursor: "pointer" }}
            icon={faUserPlus}
          />
          <div className="dropdown-content">
            <form>
              <label>
                <input placeholder="Search for token" type="text" value={this.state.tokenSearchText} onChange={this.updateTokenSearchText} />
              </label>
            </form>
            {images.filter(image => image.name.includes(this.state.tokenSearchText)).map((image, i) => {
              return <a key={i} href="#" onClick={() => this.props.setSelectedToken({"imgUrl": image.url})}>
                {image.name}
              </a>
            })}
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
              white
            </a>
            <a href="#" onClick={() => this.props.setDrawingColor("black")}>
              black
            </a>
            <a href="#" onClick={() => this.props.setDrawingColor("blue")}>
              blue
            </a>
            <a href="#" onClick={() => this.props.setDrawingColor("orange")}>
              orange
            </a>
            <a href="#" onClick={() => this.props.setDrawingColor("green")}>
              green
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
