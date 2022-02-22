import React from "react";
import * as ReactBootStrap from "react-bootstrap";

const Footer = () => {
  return (
    <div>
      <div className="App">
        <ReactBootStrap.Navbar
          collapseOnSelect
          expand="xl"
          style={{
            background: "transparent",
          }}
          sticky
        >
          <ReactBootStrap.Nav className="mr-auto"></ReactBootStrap.Nav>
          <ReactBootStrap.Nav>
            <div align="right" style={{ color: "Black" }}>
              Powered By Topic Base.
            </div>
          </ReactBootStrap.Nav>
        </ReactBootStrap.Navbar>
      </div>
    </div>
  );
};

export default Footer;
