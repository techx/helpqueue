import React from "react";
import "./App.css";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AppHeader from "./AppHeader";
import LandingPage from "./components/LandingPage";
import LoginCallback from "./components/LoginCallback";
import QueueRequest from "./components/QueueRequest";
import QueueMentor from "./components/QueueMentor";
import AdminPage from "./components/AdminPage";
import ProfilePage from "./components/ProfilePage";
import MentorLoginPage from "./components/MentorLoginPage";

const App: React.FC = () => {
  return (
    <Router>
      <CookiesProvider>
        <div className="App">
          <AppHeader />
          <Switch>
            <Route exact path="/login/auth" component={LoginCallback} />
            <Route path="/m" component={QueueMentor} />
            <Route path="/login" component={LandingPage} />
            <Route path="/login/mentor" component={MentorLoginPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/admin" component={AdminPage} />
            <Route path="/" component={QueueRequest} />
          </Switch>
        </div>
      </CookiesProvider>
    </Router>
  );
};

export default App;
