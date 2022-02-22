import React, { useState } from "react";
import { auth } from "./firebase";
import "./App.css";
import "./CSS/organization.css";
//import Home from "./Components/Navigation/Home";
import NavBar from "./Components/Navigation/Navbar";
import Footer from "./Components/Navigation/Footer";
import Organization from "./Components/Organization/Organization";
import OrganizationPage from "./Components/Organization/OrganizationPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState();
  const [showbutton, setShowButton] = useState(false);

  auth.onAuthStateChanged((user) => {
    if (user) {
      sessionStorage.setItem("user", user.displayName);
      sessionStorage.setItem("ID", user.uid);
      setUser(user.uid);
      setShowButton(true);
    } else {
      setUser("");
      setShowButton(true);
      sessionStorage.clear();
    }
  });

  return (
    <div className="App body">
      <div className="content-wrap">
        <Router>
          <NavBar user={user} setUser={setUser} showButton={showbutton} />

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/" exact>
              <Organization user={user} />
            </Route>
            <Route path="/home">
              <Organization user={user} />
            </Route>
            <Route path="/organization">
              <Organization user={user} />
            </Route>
            <Route exact path="/:slug">
              <OrganizationPage user={user} />
            </Route>
          </Switch>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
