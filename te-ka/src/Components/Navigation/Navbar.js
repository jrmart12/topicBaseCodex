import React from "react";
import { Navbar, Nav, Button, NavLink } from "react-bootstrap";
import { SignIn, LogOut } from "../../authentication/firebaseutils";

const NavBar = (props) => {
  return (
    <div>
      <div className="App">
        <Navbar collapseOnSelect expand="xl" bg="info" variant="dark">
          <Navbar.Brand>
            <Nav>
              <NavLink href="/home">Te Ka</NavLink>
            </Nav>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Nav>
              {props.user === "" || props.user === undefined ? (
                <>
                  {props.showButton ? (
                    <Button onClick={SignIn} variant="primary">
                      Log in
                    </Button>
                  ) : null}
                </>
              ) : (
                <Button onClick={LogOut} variant="info">
                  Log out
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
  );
};

export default NavBar;
