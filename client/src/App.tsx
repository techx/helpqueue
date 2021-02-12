import React, { Fragment } from "react";
import "./App.css";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AppHeader from "./AppHeader";
import LandingPage from "./components/LandingPage";
import LoginCallback from "./components/LoginCallback";
import LoginGithub from "./components/LoginGithub";
import QueueRequest from "./components/QueueRequest";
import QueueMentor from "./components/QueueMentor";
import AdminPage from "./components/AdminPage";
import ProfilePage from "./components/ProfilePage";
import FAQPage from "./components/FAQPage";

import Alert from "react-s-alert";

import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";

const App: React.FC = () => {
  return (
    <Fragment>
      <Router>
        <CookiesProvider>
          <div className="App">
            <AppHeader />
            <Switch>
              <Route exact path="/login/auth" component={LoginCallback} />
              <Route exact path="/login/github" component={LoginGithub} />
              <Route path="/m" component={QueueMentor} />
              <Route path="/login" component={LandingPage} />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/admin" component={AdminPage} />
              <Route path="/faq" component={FAQPage} />
              <Route path="/" component={QueueRequest} />
            </Switch>
          </div>
        </CookiesProvider>
      </Router>
      <Alert stack={{ limit: 3 }} />
    </Fragment>
  );
};

export default App;
