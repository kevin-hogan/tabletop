import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./App";
import Home from "./Home";

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
          <Route path={"/"} exact component={Home} />
          <Route
            path="/tabletop/:room"
            render={props => (
              <App
                {...props}
              />
            )}
          />
      </Router>
    );
  }
}

export default AppRouter;
