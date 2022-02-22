import "./App.css";
import "./CSS/organization.css";
import React, { useState } from "react";
import Home from "./Components/Navigation/Home";
import Footer from "./Components/Navigation/Footer";
import NotFound from "./Components/Navigation/NotFound";
import NavigationBar from "./Components/Navigation/Navbar";
//import Organization from "./Components/Organization";
import OrganizationPage from "./Components/Organization/OrganizationPage";
import ConceptPage from "./Components/Organization/ConceptPage";
import { auth } from "./firebase";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState("");
  const [organizationName, setOrganizationName] = useState("Te-Fiti");
  const [organizationLogo, setOrganizationLogo] = useState("");
  const [organizationColor, setOrganizationColor] = useState("#17a2b8");
  const [showbutton, setShowButton] = useState(false);

  auth.onAuthStateChanged((user) => {
    if (user) {
      sessionStorage.setItem("avatar", user.photoURL);
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
          <NavigationBar
            user={user}
            setUser={setUser}
            showButton={showbutton}
            orgLogo={organizationLogo}
            orgColor={organizationColor}
            orgName={organizationName}
          />

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/" exact>
              <Home
                user={user}
                setOrgLogo={setOrganizationLogo}
                setOrgColor={setOrganizationColor}
                setOrgName={setOrganizationName}
              />
            </Route>
            <Route exact path="/home">
              <Home
                user={user}
                setOrgLogo={setOrganizationLogo}
                setOrgColor={setOrganizationColor}
                setOrgName={setOrganizationName}
              />
            </Route>
            <Route exact path="/:slug/">
              <OrganizationPage
                setOrgLogo={setOrganizationLogo}
                setOrgColor={setOrganizationColor}
                setOrgName={setOrganizationName}
              />
            </Route>
            <Route exact path="/:slug/concepts/">
              <OrganizationPage
                setOrgLogo={setOrganizationLogo}
                setOrgColor={setOrganizationColor}
                setOrgName={setOrganizationName}
              />
            </Route>
            <Route exact path="/:slug/concepts/:conceptID">
              <ConceptPage
                setOrgLogo={setOrganizationLogo}
                setOrgColor={setOrganizationColor}
                setOrgName={setOrganizationName}
              />
            </Route>
            <Route exact path="/:slug/concepts/:conceptID/resources/">
              <ConceptPage
                setOrgLogo={setOrganizationLogo}
                setOrgColor={setOrganizationColor}
                setOrgName={setOrganizationName}
              />
            </Route>
            <Route
              exact
              path="/NotMatchSlug/PageNotFound"
              component={NotFound}
            ></Route>
            <Route exact path="" component={NotFound} />
          </Switch>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
