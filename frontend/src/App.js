import React from "react";
import "./App.css";
import Board from "./Board.js";
import Menu from "./Menu.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.navBarRef = React.createRef();
    this.mainContentRef = React.createRef();
    this.state = {
      isNavOpen: true,
      drawingColor: ""
    };
  }

  closeNav = (e) => {
    this.navBarRef.current.style.width = "25px";
    this.mainContentRef.current.style.paddingLeft = "25px";
    this.setState({ isNavOpen: false });
  };

  openNav = (e) => {
    this.navBarRef.current.style.width = "150px";
    this.mainContentRef.current.style.paddingLeft = "150px";
    this.setState({ isNavOpen: true });
  };

  setDrawingColor = (color) => {
    this.setState({drawingColor: color});
  }

  render() {
    return (
      <div className="App" style={this.state.drawingColor !== "" ? {cursor: "crosshair"} : null}>
        <div id="mySidenav" class="sidenav" ref={this.navBarRef}>
          <FontAwesomeIcon
            icon={this.state.isNavOpen ? faArrowLeft : faArrowRight}
            onClick={this.state.isNavOpen ? this.closeNav : this.openNav}
            style={{
              cursor: "pointer",
              position: "absolute",
              top: "5px",
              right: "10px",
            }}
          />
          <Menu setDrawingColor={this.setDrawingColor}/>
        </div>
        <div
          ref={this.mainContentRef}
          style={{ paddingLeft: 150, textAlign:"center", transition: "padding-left .5s" }}
        >
          <Board drawingColor={this.state.drawingColor}/>
        </div>
      </div>
    );
  }
}

export default App;
