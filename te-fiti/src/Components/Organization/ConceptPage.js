import React, { useState, useEffect } from "react";
import { useParams, Redirect, Link } from "react-router-dom";
import ShowResources from "./ShowResources";
import RequestLogin from "../Interaction/RequestLogin";
import ModalResource from "../Interaction/CreateAndEditResource";
import LanguageList from "../Interaction/LanguageFilter";
import { Spinner, Row, Col, Button, Container } from "react-bootstrap";
import { db } from "../../firebase";

const ConceptPage = (props) => {
  let { slug, conceptID } = useParams();
  const initialStateOrg = {
    title: "",
    description: "",
    conceptS: "",
    conceptP: "",
    resourceS: "",
    resourceP: "",
    slug: "",
    logoURL: "",
    colorHEX: "",
  };

  const initialStateConcept = {
    title: "",
    description: "",
    tags: "",
    owner: "",
    ownerName: "",
    photoURL: "",
    resourceAmount: 0,
  };
  const [showMessage, setShowMessage] = useState(false);
  const [show, setShow] = useState(false);
  const [dataOrg, setDataOrg] = useState(initialStateOrg);
  const [dataConcept, setDataConcept] = useState(initialStateConcept);
  const [dataResource, setDataResource] = useState([]);
  const [validSlug, setValidSlug] = useState(false);
  const [validConcept, setValidConcept] = useState(false);
  const [resource, setResource] = useState(true);
  const [spinner, setSpinner] = useState(false);
  const [spinner2, setSpinner2] = useState(false);
  const [id, setId] = useState("");
  const [showRequestLogin, setShowRequestLogin] = useState(false);
  const [buttonText, setButtonText] = useState("Create");
  const [titleText, setTitleText] = useState("Create new");
  const [resourceID, setResourceID] = useState("");
  const [language, setLanguage] = useState(
    window.navigator.language.replace("_", "-")
  );
  const [activeVote, setActiveVote] = useState([]);

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setButtonText("Create");
    setTitleText("Create new");
    setResourceID("");
  };

  const handleShowRequestLogin = () => {
    setShowRequestLogin(true);
  };

  const handleCloseRequestLogin = () => {
    setShowRequestLogin(false);
  };

  const GetInfoFromSlug = () => {
    db.collection("organization")
      .where("slug", "==", slug)
      .onSnapshot((snapshot) => {
        if (snapshot.empty) {
          console.log("not Match");
          setValidSlug(false);
        } else {
          setValidSlug(true);
          snapshot.forEach((doc) => {
            let ID = "none";
            const d = doc.data();
            if (doc.id !== "") {
              ID = doc.id;
              setDataOrg({ ...d, id: doc.id });
            }
            GetConceptInfo(ID);
            VoteArray(ID);
          });
        }
      });
  };

  useEffect(() => {
    setTimeout(() => {
      setShowMessage(false);
    }, 10000);
  }, [showMessage]);

  useEffect(() => {
    if (dataOrg.title !== "") {
      props.setOrgName(dataOrg.title);
      props.setOrgColor(dataOrg.colorHEX);
      props.setOrgLogo(dataOrg.logoURL);
    }
  });

  const GetConceptInfo = (ID) => {
    setId(ID);
    db.collection("organization")
      .doc(ID)
      .collection("concepts")
      .doc(conceptID)
      .onSnapshot((doc) => {
        if (!doc.exists) {
          setValidConcept(false);
        } else {
          setValidConcept(true);
          //save data on the Data state
          setDataConcept({ ...doc.data(), id: doc.id });
          GetResourceInfo(ID);
        }
      });
  };

  const VoteArray = (ID) => {
    db.collection("organization")
      .doc(ID)
      .collection("concepts")
      .doc(conceptID)
      .collection("votes")
      .onSnapshot((data) => {
        //a listener form because we need to now when the votes collection change to be able to change
        //the color of the selection
        if (data.empty) {
        } else {
          let temp = [];
          data.forEach((doc) => {
            temp.push({
              resourceID: doc.data().resourceID,
              user: doc.data().user,
              type: doc.data().type,
            });
          });
          setActiveVote(temp);
        }
      });
  };

  const GetResourceInfo = (ID) => {
    setSpinner2(true);
    db.collection("organization")
      .doc(ID)
      .collection("concepts")
      .doc(conceptID)
      .collection("resources")
      .orderBy("title", "asc")
      .onSnapshot((Snapshot) => {
        if (Snapshot.empty) {
          setResource(false);
          setSpinner2(false);
        } else {
          const docInfo = []; // here will save the resource object
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
          //function to OrderBy Rank
          docInfo.sort(function (a, b) {
            const A = a.rank;
            const B = b.rank;
            return B - A;
          });
          //if the docInfo.length is 0 means that there exist a colletion but there are only archive concepts

          if (docInfo.length === 0) {
            setResource(false);
          }
          setDataResource(docInfo); //save data on the Data state
        }
        setSpinner2(false);
      });
    setSpinner(true);
  };

  const NewResource = () => {
    if (
      sessionStorage.getItem("ID") !== "" &&
      sessionStorage.getItem("ID") !== null
    ) {
      handleShow();
    } else {
      handleShowRequestLogin();
    }
  };

  useEffect(() => {
    GetInfoFromSlug();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {validSlug === true && validConcept === true ? (
        <div>
          <Container>
            <br />
            <Row>
              <Col align="left">
                <Link to={`/${dataOrg.slug}`}>{dataOrg.title}</Link>
                {"  >  "}
                <Link to={`/${dataOrg.slug}/concepts/${dataConcept.id}`}>
                  {dataConcept.title}
                </Link>
              </Col>
              <Col align="right">
                <label>Language</label>
                <LanguageList
                  DataResource={dataResource}
                  language={language}
                  setLanguage={setLanguage}
                />
              </Col>
            </Row>
            <hr />
            <Row>
              <Col>
                <div align="left">
                  <h1>{dataConcept.title}</h1>
                </div>
                <div align="left">
                  This is a list of your {dataOrg.resourceP.toLowerCase()}
                </div>
              </Col>
              <Col align="center">
                <br />
                <div align="right">
                  <Button
                    className="Button"
                    onClick={() => {
                      NewResource();
                    }}
                  >
                    New {dataOrg.resourceS}
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
          <br />
          <Container>
            {spinner2 === false ? (
              <>
                {validConcept === true ? (
                  <ShowResources
                    language={language}
                    showMessage={showMessage}
                    setShowMessage={setShowMessage}
                    setResourceID={setResourceID}
                    DataOrg={dataOrg}
                    DataConcept={dataConcept}
                    id={id}
                    data={dataResource}
                    conceptOwner={dataConcept.owner}
                    resource={resource}
                    setResource={setResource}
                    conceptID={conceptID}
                    setTitleText={setTitleText}
                    setButtonText={setButtonText}
                    handleShow={handleShow}
                    activeVote={activeVote}
                    setActiveVote={setActiveVote}
                    VoteArray={VoteArray}
                    setLanguage={setLanguage}
                  />
                ) : (
                  <></>
                )}
              </>
            ) : (
              <Spinner animation="grow" variant="info" />
            )}
          </Container>
          <ModalResource
            language={language}
            setLanguage={setLanguage}
            setShowMessage={setShowMessage}
            orgID={id}
            conceptID={conceptID}
            conceptOwner={dataConcept.owner}
            resourceID={resourceID}
            buttonText={buttonText}
            setButtonText={setButtonText}
            titleText={titleText}
            resourceTitle={dataOrg.resourceS}
            data={dataResource}
            show={show}
            onHide={handleClose}
            handleClose={handleClose}
          />
          <RequestLogin
            showRequestLogin={showRequestLogin}
            handleCloseRequestLogin={handleCloseRequestLogin}
          />
        </div>
      ) : (
        <>
          {spinner === false ? (
            <div>
              <Spinner animation="border" variant="info" />
            </div>
          ) : (
            <Redirect to="/NotMatchSlug/PageNotFound" />
          )}
        </>
      )}
    </>
  );
};

export default ConceptPage;
