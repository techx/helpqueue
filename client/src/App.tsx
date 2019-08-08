import React from "react";
import "./App.css";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AppHeader from "./AppHeader";
import LandingPage from "./components/LandingPage";
import LoginCallback from "./components/LoginCallback";

const App: React.FC = () => {
  document.title = process.env.REACT_APP_NAME || "";
  return (
    <Router>
      <CookiesProvider>
        <div className="App">
          <AppHeader />
          <Switch>
            <Route exact path="/login/auth" component={LoginCallback} />
            <Route path="/" component={LandingPage} />
          </Switch>
        </div>
      </CookiesProvider>
    </Router>
  );
};

export default App;
