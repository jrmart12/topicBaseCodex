import React, { useState, useEffect } from "react";
import { useParams, Redirect, Link } from "react-router-dom";
import ModalConcepts from "../Interaction/CreateAndEditConcept";
import { Button, Container, Col, Row, Spinner } from "react-bootstrap";
import { db } from "../../firebase";
//import { Redirect } from "react-router-dom";
import ShowConcepts from "./ShowConcepts";
import RequestLogin from "../Interaction/RequestLogin";

const OrganizationPage = (props) => {
  let { slug } = useParams();
  const initialStateOrg = {
    title: "",
    description: "",
    conceptS: "",
    conceptP: "",
    resourceS: "",
    resourceP: "",
    slug: "",
  };

  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [dataOrg, setDataOrg] = useState(initialStateOrg);
  const [buttonText, setButtonText] = useState("Create");
  const [titleText, setTitleText] = useState("Create new");
  const [id, setId] = useState("");
  const [validSlug, setValidSlug] = useState(false);
  const [concept, setConcepts] = useState(true);
  const [conceptId, setConceptId] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [spinner2, setSpinner2] = useState(false);
  const [showRequestLogin, setShowRequestLogin] = useState(false);

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setButtonText("Create");
    setTitleText("Create new");
    setConceptId("");
  };

  const handleShowRequestLogin = () => {
    setShowRequestLogin(true);
  };

  const handleCloseRequestLogin = () => {
    setShowRequestLogin(false);
  };

  const GetInfoFromSlug = () => {
    setSpinner(false);
    db.collection("organization")
      .where("slug", "==", slug)
      .onSnapshot((snapshot) => {
        if (snapshot.empty) {
          console.log("not Match");
          setValidSlug(false);
          setSpinner(true);
        } else {
          setValidSlug(true);
          snapshot.forEach((doc) => {
            let ID = "none";
            const d = doc.data();
            if (doc.id !== "") {
              ID = doc.id;
              setDataOrg({ ...d, id: doc.id });
            }
            setSpinner(true);
            GetConceptsList(ID);
          });
        }
      });
  };

  const NewConcept = () => {
    if (
      sessionStorage.getItem("ID") !== "" &&
      sessionStorage.getItem("ID") !== null
    ) {
      setConceptId("");
      handleShow();
    } else {
      handleShowRequestLogin();
    }
  };

  useEffect(() => {
    GetInfoFromSlug();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetConceptsList = (ID) => {
    setSpinner2(true);
    setId(ID);
    db.collection("organization")
      .doc(ID)
      .collection("concepts")
      .orderBy("title", "asc")
      .onSnapshot((Snapshot) => {
        if (Snapshot.empty) {
          setConcepts(false);
          setSpinner2(false);
        } else {
          const docInfo = []; // here will save the concept object
          Snapshot.forEach((doc) => {
            if (doc.data().archive === false) {
              docInfo.push({ ...doc.data(), id: doc.id });
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
          setData(docInfo); //save data on the Data state
          setSpinner2(false);
        }
      });
  };

  useEffect(() => {
    if (dataOrg.title !== "") {
      props.setOrgName(dataOrg.title);
      props.setOrgColor(dataOrg.colorHEX);
      props.setOrgLogo(dataOrg.logoURL);
    }
  });

  return (
    <>
      {validSlug === true ? (
        <div>
          <Container>
            <br />
            <Row>
              <Link to={`/${dataOrg.slug}`}>{dataOrg.title}</Link>
            </Row>
            <hr />
            <Row>
              <Col>
                <div align="left">
                  <h1>{dataOrg.title}</h1>
                </div>
                <div align="left">
                  This is a list of your {dataOrg.conceptP.toLowerCase()}
                </div>
              </Col>
              <Col align="center">
                <br />
                <div align="right">
                  <Button
                    className="Button"
                    onClick={() => {
                      NewConcept();
                    }}
                  >
                    New {dataOrg.conceptS}
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
          <br />
          <div>
            {spinner2 === false ? (
              <>
                <ShowConcepts
                  DataOrg={dataOrg}
                  setConcepts={setConcepts}
                  data={data}
                  id={id}
                  concept={concept}
                  setTitleText={setTitleText}
                  setButtonText={setButtonText}
                  handleShow={handleShow}
                  conceptId={conceptId}
                  setConceptId={setConceptId}
                />
              </>
            ) : (
              <>
                <Spinner animation="grow" variant="info" />
              </>
            )}
          </div>
          <div>
            <ModalConcepts
              show={show}
              id={id}
              conceptId={conceptId}
              setConceptId={setConceptId}
              buttonText={buttonText}
              setButtonText={setButtonText}
              setTitleText={setTitleText}
              titleText={titleText}
              conceptTitle={dataOrg.conceptS}
              data={data}
              onHide={handleClose}
              handleClose={handleClose}
            />
            <RequestLogin
              showRequestLogin={showRequestLogin}
              handleCloseRequestLogin={handleCloseRequestLogin}
            />
          </div>
        </div>
      ) : (
        <div>
          {spinner === false ? (
            <div>
              <Spinner animation="border" variant="info" />
            </div>
          ) : (
            <Redirect to="/NotMatchSlug/PageNotFound" />
          )}
        </div>
      )}
    </>
  );
};

export default OrganizationPage;
