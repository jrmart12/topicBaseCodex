import React, { useEffect, useState } from "react";
import { Navbar, Nav, Button, Image } from "react-bootstrap";
import { SignIn, LogOut } from "../../authentication/firebaseutils";

const NavigationBar = (props) => {
  const [titleColor, setTitleColor] = useState("organizationTitleWhite");
  const [variant, setVariant] = useState("dark");
  const [image, setImage] = useState("");

  const ColorEvaluate = () => {
    var r = parseInt(props.orgColor.substr(1, 2), 16);
    var g = parseInt(props.orgColor.substr(3, 2), 16);
    var b = parseInt(props.orgColor.substr(5, 2), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128;
  };

  useEffect(() => {
    if (props.orgColor !== undefined) {
      if (ColorEvaluate() === true) {
        setTitleColor("organizationTitleBlack");
        setVariant("light");
      } else {
        setTitleColor("organizationTitleWhite");
        setVariant("dark");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.orgColor]);

  useEffect(() => {
    if (props.orgLogo !== undefined || props.orgLogo === "") {
      setImage(props.orgLogo);
    } else {
      setImage(
        "https://firebasestorage.googleapis.com/v0/b/te-fiti-dev-399d0.appspot.com/o/Default%20Image.png?alt=media&token=160b8279-e4ec-4934-bc69-8bcbf1769931"
      );
    }
  }, [props.orgLogo]);

  return (
    <div>
      <div className="App">
        <Navbar
          collapseOnSelect
          expand="xl"
          style={{ background: `${props.orgColor}` }}
          variant={variant}
        >
          <Navbar.Brand>
            <div className={titleColor}>
              <Image
                src={image}
                roundedCircle
                fluid
                className="avatarOrganization"
              />
              {props.orgName}
            </div>
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

export default NavigationBar;
