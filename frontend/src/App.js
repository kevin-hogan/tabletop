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
      drawingColor: "",
      selectedToken: ""
    };
  }

  handleGlobalKeyDown = (e) => {
    switch( e.key ) {
      case "Escape":
          this.setSelectedToken("");
          this.setDrawingColor("");
          break;
      default: 
          break;
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleGlobalKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleGlobalKeyDown);
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

  setSelectedToken = (token) => {
    this.setState({selectedToken: token});
  }

  setDrawingColor = (color) => {
    this.setState({drawingColor: color});
  }

  render() {
    let cursor = "";
    if (this.state.drawingColor !== "") {
      cursor = "crosshair"
    } else if (this.state.selectedToken !== "") {
      cursor = "copy"
    }
    return (
      <div className="App" style={{cursor: cursor}}>
        <div id="mySidenav" className="sidenav" ref={this.navBarRef}>
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
          <Menu setSelectedToken={this.setSelectedToken} setDrawingColor={this.setDrawingColor}/>
        </div>
        <div
          ref={this.mainContentRef}
          style={{ paddingLeft: 150, textAlign:"center", transition: "padding-left .5s" }}
        >
          <Board 
            drawingColor={this.state.drawingColor}
            selectedToken={this.state.selectedToken}
            room={this.props.match.params.room}
          />
        </div>
      </div>
    );
  }
}

export default App;
