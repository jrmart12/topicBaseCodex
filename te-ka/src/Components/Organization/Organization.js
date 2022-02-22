import React, { useState, useEffect } from "react";
import Modal from "./CreateEditOrganization";
import ShowOrganization from "./ShowOrganization";
import { db } from "../../firebase";
import { Container, Button, Spinner } from "react-bootstrap";

const Organization = (props) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [buttonText, setButtonText] = useState("Create");
  const [titleText, setTitleText] = useState("Create");
  const [id, setId] = useState("");
  const [orgExist, setOrgExist] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const [logMessage, setLogMessage] = useState("");

  const handleClose = () => {
    setShow(false);
    setButtonText("Create");
    setTitleText("Create");
    setId("");
  };
  const handleShow = () => setShow(true);

  const GetInfo = async () => {
    setSpinner(true);
    const MyOrgs = []; //saves the ID's of the organization
    let flag = false; // to know of we can save or no the organization

    //Catch the ID's of the organization that belongs to the logged user
    db.collection("owners")
      .where("owner", "==", sessionStorage.getItem("ID"))
      .onSnapshot((Snapshot) => {
        if (Snapshot.empty) {
          setOrgExist(false);
        } else {
          Snapshot.forEach((doc) => {
            let orgInfo = doc.data();
            MyOrgs.push(orgInfo.orgID);
          });
        }

        //once we have all the ID's,We'll Catch the organization collection but just save the organization
        //that are in the MyOrgs array
        db.collection("organization")
          .where("archive", "==", false)
          .onSnapshot((Snapshot) => {
            if (Snapshot.empty) {
              setOrgExist(false);
            } else {
              const docInfo = []; // here will save the organization object
              Snapshot.forEach((doc) => {
                for (let i = 0; i < MyOrgs.length; i++) {
                  if (doc.id === MyOrgs[i]) {
                    flag = true;
                  }
                }
                if (flag === true) {
                  // if is true saves the info of the organization
                  docInfo.push({ ...doc.data(), id: doc.id });
                  flag = false;
                }
              });
              //function to OrderBy title alphabetically key insensitive
              docInfo.sort(function (a, b) {
                const titleA = a.title.toLowerCase();
                const titleB = b.title.toLowerCase();
                if (titleA > titleB) {
                  return 1;
                }
                if (titleA < titleB) {
                  return -1;
                }
                return 0;
              });
              if (flag === false) {
                if (docInfo.length === 0) {
                  setOrgExist(false);
                } else {
                  setOrgExist(true);
                }
                setData(docInfo); //save data on the Data state
                setSpinner(false);
              }
            }
          });
      });
  };

  useEffect(() => {
    debugger;
    //first case is when you log in
    if (props.user !== "" && props.user !== undefined) {
      GetInfo();
      setLogMessage("");
    } else if (props.user === "" && data.length === 0) {
      //second case is when you are not logged in
      setSpinner(false);
      setLogMessage("Please Log In to see organization");
    } else if (
      props.user === undefined &&
      sessionStorage.getItem("ID") !== null
    ) {
      //last case is when you are logged in and you enter to the page for the first time
      setLogMessage("");
    }
  }, [props, data.length]);

  return (
    <div className="App">
      {spinner === false ? (
        <>
          {props.user !== undefined &&
          props.user !== "" &&
          sessionStorage.getItem("ID") !== null ? (
            <div>
              <br />
              <Container>
                <div align="left">
                  <h1>Organization</h1>
                </div>
                <div align="right">
                  <Button
                    onClick={() => {
                      handleShow();
                    }}
                  >
                    New Organization
                  </Button>
                </div>
              </Container>
              <br />
              <Container>
                <ShowOrganization
                  setId={setId}
                  id={id}
                  setTitleText={setTitleText}
                  titleText={titleText}
                  setButtonText={setButtonText}
                  buttonText={buttonText}
                  show={show}
                  handleShow={handleShow}
                  GetInfo={GetInfo}
                  data={data}
                  orgExist={orgExist}
                />
              </Container>
              <Container>
                <Modal
                  id={id}
                  setTitleText={setTitleText}
                  titleText={titleText}
                  setButtonText={setButtonText}
                  buttonText={buttonText}
                  show={show}
                  onHide={handleClose}
                  href="#SignIn"
                />
              </Container>
            </div>
          ) : (
            <div>
              {props.user === "" && sessionStorage.getItem("ID") === null ? (
                <>
                  <h1>{logMessage}</h1>
                </>
              ) : null}
            </div>
          )}
        </>
      ) : (
        <Spinner animation="grow" variant="info" />
      )}
    </div>
  );
};

export default Organization;
