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
        this.props.history.push("/tabletop/" + responseJson["room"])
      }.bind(this))
  }

  render() {
    return (
      <button onClick={this.createRoom}>Create new room</button>
    );
  }
}

export default Home;