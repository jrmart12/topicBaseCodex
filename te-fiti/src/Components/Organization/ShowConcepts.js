import React, { useState, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import {
  Form,
  Container,
  Card,
  Button,
  Row,
  Col,
  Image,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
//import ArchiveModalConfirm from "../Interaction/ArchiveConcept";
import RequestLogin from "../Interaction/RequestLogin";

const ShowConcepts = (props) => {
  //const [showArchive, setShowArchive] = useState(false);
  const [showRequestLogin, setShowRequestLogin] = useState(false);
  /*const [conceptTitle, setConceptTitle] = useState("");
  const [name, setName] = useState("");
  const [idArchive, setIdArchive] = useState("");*/

  /* const handleShowArchive = (title, conceptId) => {
    setName(props.DataOrg.ConceptS);
    setIdArchive(conceptId);
    setConceptTitle(title);
    setShowArchive(true);
  };*/

  /*const handleCloseArchive = () => {
    setShowArchive(false);
  };*/

  const handleCloseRequestLogin = () => {
    setShowRequestLogin(false);
  };

  const Search = () => {
    let input, filter, ul, li, a, i, ListDiv, specificDiv, txtValueD;
    input = document.getElementById("SearchInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("OrgList");
    li = ul.getElementsByTagName("li");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("div")[0]; // catch all the list of divs in the li list
      //take only the terms needed
      //for some reason 'a' get undefined because the length is higher
      if (a !== undefined) {
        ListDiv = a.getElementsByTagName("div"); //get the list of specific divs

        for (let j = 0; j < ListDiv.length; j++) {
          specificDiv = ListDiv[j]; //select the current div
          txtValueD = specificDiv.innerText || specificDiv.textContent; //select the text of the current div
          if (specificDiv.id === "Part") {
            //validate if that div is part of the searh
            if (txtValueD.toUpperCase().indexOf(filter) > -1) {
              li[i].style.display = "";
              break; //if found a match breaks the cycle may be in title, or description and for last for the tags,
              //if the circle does not break, the search always will be for the last which means for the tags
            } else {
              li[i].style.display = "none";
            }
          }
        }
      }
    }
  };

  /*const ArchiveConcept = (title, conceptid) => {
    handleShowArchive(title, conceptid);
  };*/

  const ShowModalFromEdit = async (id) => {
    props.setTitleText("Save");
    props.setButtonText("Save");
    props.setConceptId(id);
    props.handleShow();
  };

  useEffect(() => {
    if (props.data.length > 0) {
      props.setConcepts(true);
    } else {
      props.setConcepts(false);
    }
  }, [props]);

  const ShowName = (id, name) => {
    return <Tooltip id={`creator-${id}`}>Created by: {name}</Tooltip>;
  };

  return (
    <>
      <Container>
        <Form.Control
          type="text"
          id="SearchInput"
          onKeyUp={Search}
          placeholder={`Search ${props.DataOrg.conceptP.toLowerCase()}`}
        ></Form.Control>
      </Container>
      {props.concept === false ? (
        <>
          <br />
          <h4>
            There are no {props.DataOrg.conceptP.toLowerCase()} yet, create one.
          </h4>
        </>
      ) : (
        <>
          <br />
          <Container>
            <ul id="OrgList">
              {props.data.map((data) => (
                <div key={data.id}>
                  <>
                    <li key={data.id}>
                      <Card style={{ color: "#000" }}>
                        <Card.Header>
                          <Row>
                            <Col as="h3" align="left">
                              <div id="Part">
                                <Link
                                  className="Hyperlink"
                                  to={`/${props.DataOrg.slug}/concepts/${data.id}`}
                                >
                                  {data.title}
                                </Link>
                              </div>
                            </Col>
                            <Col align="right">
                              <div id="notPart" size="sm">
                                <OverlayTrigger
                                  key={data.id}
                                  sm={4}
                                  overlay={ShowName(data.id, data.ownerName)}
                                >
                                  <Image
                                    src={data.photoURL}
                                    roundedCircle
                                    fluid
                                    className="avatarConcept"
                                  ></Image>
                                </OverlayTrigger>
                              </div>
                            </Col>
                          </Row>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col>
                              <div align="left" id="Part">
                                <Markdown>{data.description}</Markdown>
                              </div>
                            </Col>
                            <Col>
                              <div align="right" id="notPart">
                                {sessionStorage.getItem("ID") !== null &&
                                sessionStorage.getItem("ID") !== "" ? (
                                  data.owner ===
                                  sessionStorage.getItem("ID") ? (
                                    <>
                                      {/*<Button
                                        className="Button"
                                        variant="outline-secondary"
                                        onClick={() =>
                                          ArchiveConcept(data.title, data.id)
                                        }
                                      >
                                        Archive
                                      </Button>*/}
                                      <Button
                                        className="Button"
                                        variant="primary"
                                        onClick={() =>
                                          ShowModalFromEdit(data.id)
                                        }
                                      >
                                        Edit
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      {/*<Button
                                        className="Button"
                                        variant="outline-secondary"
                                        disabled
                                      >
                                        Archive
                                      </Button>*/}

                                      <Button
                                        className="Button"
                                        variant="primary"
                                        disabled
                                      >
                                        Edit
                                      </Button>
                                    </>
                                  )
                                ) : (
                                  <></>
                                )}
                              </div>
                            </Col>
                          </Row>
                          <hr />
                          <div align="left" id="Part">
                            {data.tags}
                          </div>
                          {data.resourceAmount !== undefined ? (
                            <div align="right" id="notPart">
                              Amount of resources: {data.resourceAmount}
                            </div>
                          ) : (
                            <div align="right" id="notPart">
                              Waiting for update.
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                      <br />
                    </li>
                  </>
                </div>
              ))}
            </ul>
          </Container>
        </>
      )}
      {/*<ArchiveModalConfirm
        id={props.id}
        conceptId={idArchive}
        name={name}
        title={conceptTitle}
        showArchive={showArchive}
        handleCloseArchive={handleCloseArchive}
      />*/}
      <RequestLogin
        showRequestLogin={showRequestLogin}
        handleCloseRequestLogin={handleCloseRequestLogin}
      />
    </>
  );
};

export default ShowConcepts;
