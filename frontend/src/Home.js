import React from "react";
import "./Home.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createRoom = () => {
    return fetch("http://localhost:5000/room", {
      method: "POST",
      mode: "cors"
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (responseJson) {
        window.open("/tabletop/" + responseJson["room"], "_blank")
      }.bind(this))
  }

  render() {
    return (
      <div className="homepage-content">
        <h1>RPG Tabletop Live</h1>
        <p><i>The simplest virtual tabletop around</i></p>
        <button onClick={this.createRoom}>Create new</button>
      </div>
    );
  }
}

export default Home;