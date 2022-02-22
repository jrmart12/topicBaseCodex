import React, { useEffect, useState, useRef } from "react";
import ShowComments from "./ShowComments";
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
  ListGroup,
} from "react-bootstrap";
import ArchiveModalConfirm from "../Interaction/ArchiveResource";
import AlertResource from "../Interaction/AlertEditArchiveResource";
import RequestLogin from "../Interaction/RequestLogin";
import { Languages } from "../utilities/utils";
import Markdown from "markdown-to-jsx";
import { db } from "../../firebase";
import { useParams } from "react-router-dom";
import {
  AiFillCaretUp as UpVote,
  AiFillCaretDown as DownVote,
} from "react-icons/ai";

const ShowResources = (props) => {
  let { conceptID } = useParams();
  const [showArchive, setShowArchive] = useState(false);
  const [showRequestLogin, setShowRequestLogin] = useState(false);
  const [name, setName] = useState("");
  const [idArchive, setIdArchive] = useState("");
  const [resourceIDArchive, setResourceIDArchive] = useState("");
  const [conceptTitle, setConceptTitle] = useState("");
  const [resourceCount, setResourceCount] = useState([]);
  const [languageAvailableInfo, setLanguageAvailableInfo] = useState(true);

  const liref = useRef(null);

  const Vote = (resourceID, type, rank) => {
    if (type === "up") {
      document.getElementById(`VoteUp${resourceID}`).className =
        "disabledContent";
      SetVote(resourceID, type, rank);
    } else {
      document.getElementById(`VoteDown${resourceID}`).className =
        "disabledContent";
      SetVote(resourceID, type, rank);
    }
  };
  const SetVote = async (resourceID, type, rank) => {
    //load the collection of votes to find votes
    //to analyze if its have already a vote if it's not the case, create the vote otherwise modify it
    //be sure that this function doesn't be a listener function, don't use "OnSnapshot" or "Snapshot"
    //to secure that there are no loop
    await db
      .collection("organization")
      .doc(props.id)
      .collection("concepts")
      .doc(conceptID)
      .collection("votes")
      .get()
      .then((docs) => {
        if (docs.empty) {
          CreateVote(resourceID, type, rank);
        } else {
          FindVote(resourceID, type, rank);
        }
      });
  };

  const CreateVote = (resourceID, type, rank) => {
    db.collection("organization")
      .doc(props.id)
      .collection("concepts")
      .doc(conceptID)
      .collection("votes")
      .add({
        user: sessionStorage.getItem("ID"),
        type: type,
        resourceID: resourceID,
      })
      .then(() => {
        ModifyRank(resourceID, type, rank, "none");
      });
  };

  //typeBefore has the value of the vote that the resource has before the actual click
  const ModifyVote = (resourceID, type, voteID, rank, typeBefore) => {
    db.collection("organization")
      .doc(props.id)
      .collection("concepts")
      .doc(conceptID)
      .collection("votes")
      .doc(voteID)
      .update({
        type: type,
      })
      .then(() => {
        //console.log("id", voteID);
        ModifyRank(resourceID, type, rank, typeBefore);
      });
  };

  const FindVote = (resourceID, type, rank) => {
    let flag = false;
    db.collection("organization")
      .doc(props.id)
      .collection("concepts")
      .doc(conceptID)
      .collection("votes")
      .get()
      .then((doc) => {
        if (doc.empty) {
          CreateVote(resourceID, type, "none");
        } else {
          doc.forEach((doc) => {
            if (
              doc.data().resourceID === resourceID &&
              doc.data().user === sessionStorage.getItem("ID")
            ) {
              flag = true;
              //look if the button that was click was the same that he/she already click in that case
              //substitute the vote for the state of "none" that means "no votes"
              if (doc.data().type === type) {
                ModifyVote(resourceID, "none", doc.id, rank, type);
              } else {
                ModifyVote(resourceID, type, doc.id, rank, doc.data().type);
              }
            }
          });
          //if the vote doesn't exist create te vote.
          if (flag === false) {
            CreateVote(resourceID, type, rank);
          }
        }
      });
  };

  const ModifyRank = (resourceID, type, rank1, typeBefore) => {
    //for update the resource ranking
    //if typeBefore is iquals to null means that there are no state for that vote or the status of the vote is "none"
    //so we choose only for up or down

    if (typeBefore === "none") {
      if (type === "up") {
        rank1 = rank1 + 1;
      } else if (type === "down") {
        rank1 = rank1 - 1;
      }
    } else {
      //if typeBefore has a different state like up or down, we have to validated and change the value of the rank

      if (typeBefore === "up" && type === "up") {
        rank1 = rank1 - 1;
      } else if (typeBefore === "down" && type === "up") {
        rank1 = rank1 + 2;
      } else if (typeBefore === "up" && type === "none") {
        rank1 = rank1 - 1;
      } else if (typeBefore === "up" && type === "down") {
        rank1 = rank1 - 2;
      } else if (typeBefore === "down" && type === "down") {
        rank1 = rank1 + 1;
      } else if (typeBefore === "down" && type === "none") {
        rank1 = rank1 + 1;
      }
    }

    db.collection("organization")
      .doc(props.id)
      .collection("concepts")
      .doc(conceptID)
      .collection("resources")
      .doc(resourceID)
      .update({
        rank: rank1,
      })
      .then(() => {
        liref.current = document.getElementById(`${resourceID}`);
        if (
          liref.current.className !== null &&
          liref.current.className !== undefined
        ) {
          liref.current.className = "highlight";
          liref.current.focus();
        }
        document.getElementById(`VoteUp${resourceID}`).className = "";
        document.getElementById(`VoteDown${resourceID}`).className = "";
      });
  };

  const ClearClass = () => {
    if (liref.current !== null && liref.current !== undefined) {
      liref.current.className = "";
    }
  };

  const GetVoteColorUp = (resourceID) => {
    // activeVote is an array of object that has the information of the votes, use this way tbe able to break the cicle
    //when its need it
    let color = false;
    if (props.activeVote.length > 0) {
      for (let i = 0; i < props.activeVote.length; i++) {
        if (
          props.activeVote[i].resourceID === resourceID &&
          props.activeVote[i].user === sessionStorage.getItem("ID") &&
          props.activeVote[i].type === "up"
        ) {
          color = true;
          break;
        } else {
          color = false;
        }
      }
    }

    return color;
  };

  const GetVoteColorDown = (resourceID) => {
    let color = false;
    // cargar un arreglo que diga el recursos y que voto esta activo y cual no de ese recurso para ese usuario
    if (props.activeVote.length > 0) {
      for (let i = 0; i < props.activeVote.length; i++) {
        if (
          props.activeVote[i].resourceID === resourceID &&
          props.activeVote[i].user === sessionStorage.getItem("ID") &&
          props.activeVote[i].type === "down"
        ) {
          color = true;
          break;
        } else {
          color = false;
        }
      }
    }
    return color;
  };

  const convertText = (txtData) => {
    //regular expresion
    let email = /[\w]+\.?[\w]+@{1}[\w]+\.[a-z]{2,3}/gi; // identify email pattern
    let result = "";

    result = txtData.replaceAll(email, ' -<a href="mailto:$&" >$&</a> '); //replace the email string to an "a" tag associated to mailto function

    return result; //sent the result string
  };

  const Search = () => {
    let input, filter, ul, li, a, i, ListDiv, specificDiv, txtValueD;
    input = document.getElementById("SearchInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("OrgList");
    if (ul !== null) {
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
    }
  };

  const ArchiveResource = (title, conceptId) => {
    handleShowArchive(title, conceptId);
  };

  const handleShowArchive = (title, resourceID) => {
    setName(props.DataOrg.resourceS);
    setIdArchive(props.conceptID);
    setResourceIDArchive(resourceID);
    setConceptTitle(title);
    setShowArchive(true);
  };

  const handleCloseArchive = () => {
    setShowArchive(false);
  };

  const handleShowRequestLogin = () => {
    setShowRequestLogin(true);
  };

  const handleCloseRequestLogin = () => {
    setShowRequestLogin(false);
  };

  const ShowModalFromEdit = async (id) => {
    props.setTitleText("Save");
    props.setButtonText("Save");
    props.setResourceID(id);
    props.handleShow();
  };

  useEffect(() => {
    //with this there is no need to refresh, when the props change evaluate and show the resource when it's create
    if (props.data.length > 0) {
      props.setResource(true);
    } else {
      props.setResource(false);
    }
    //console.log(props.DataConcept);
    //console.log(props.DataOrg);
  }, [props]);

  const KnowLanguages = () => {
    let LanguageAvailable = [];
    let ResourceLanguageInfo = [];
    let i = 0;
    let count = 0;
    let j = 0;
    let flag = false;

    //to extract the info about languages,
    for (i; i < props.data.length; i++) {
      LanguageAvailable.push(props.data[i].language.substr(0, 2));
    }
    //ListtoEvaluate have the languages codes without duplicates
    const ListToEvaluate = LanguageAvailable.reduce((acc, item) => {
      if (!acc.includes(item)) {
        acc.push(item);
      }
      return acc;
    }, []);

    i = 0;

    for (j; j < ListToEvaluate.length; j++) {
      //flag gave us the information that the language selected by default is available on the list of languages
      //on resources, true means that the language exist on resources
      if (ListToEvaluate[j] === props.language.substr(0, 2)) {
        flag = true;
      }
      //count the times of a language appears to know how many resources are on that specific language
      for (i; i < LanguageAvailable.length; i++) {
        if (ListToEvaluate[j] === LanguageAvailable[i]) {
          count = count + 1; //the quantity of resources
        }
      }
      //saving the info on a array of objects
      const temp = { language: ListToEvaluate[j], N: count };
      ResourceLanguageInfo.push(temp);
      count = 0;
      i = 0;
    }

    ResourceLanguageInfo.sort(function (a, b) {
      const A = Languages[a.language].toLowerCase();
      const B = Languages[b.language].toLowerCase();
      if (A > B) {
        return 1;
      }
      if (A < B) {
        return -1;
      }
      return 0;
    });

    setResourceCount(ResourceLanguageInfo);
    setLanguageAvailableInfo(flag);
  };

  useEffect(() => {
    if (props.data.length > 0) {
      KnowLanguages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data.length]);

  const ChangeLanguage = (language) => {
    props.setLanguage(language);
    setLanguageAvailableInfo(true);
  };

  useEffect(() => {
    if (languageAvailableInfo === false) {
      setLanguageAvailableInfo(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.language]);

  const ShowName = (id, name) => {
    return <Tooltip id={`creator-${id}`}>Created by: {name}</Tooltip>;
  };

  return (
    <>
      <div>
        <Form.Control
          type="text"
          id="SearchInput"
          onKeyUp={Search}
          placeholder={`Search ${props.DataOrg.resourceP.toLowerCase()}`}
        ></Form.Control>
      </div>
      <br />
      <Container>
        <AlertResource
          resourceNoun={props.DataOrg.resourceS}
          show={props.showMessage}
          close={props.setShowMessage}
        />
      </Container>
      <div>
        {props.resource === false ? (
          <>
            <br />
            <div>
              <h4>
                There are no {props.DataOrg.resourceP.toLowerCase()} yet, create
                one.
              </h4>
            </div>
          </>
        ) : (
          <>
            <br />
            <Container>
              <ul id="OrgList">
                <div>
                  {props.language.substr(0, 2) === "al" ? (
                    <>
                      {
                        props.data.map((data) => (
                          <div key={data.id}>
                            <div
                              tabIndex="0"
                              id={data.id}
                              onAnimationEnd={ClearClass}
                            >
                              <li key={data.id} tabIndex="0">
                                <Row className="justify-content-md-center">
                                  <Col>
                                    <Card
                                      style={{ color: "#000" }}
                                      id={data.id}
                                    >
                                      <Card.Header>
                                        <Row>
                                          <Col as="div" md="auto">
                                            {sessionStorage.getItem("ID") !==
                                              null &&
                                            sessionStorage.getItem("ID") !==
                                              "" ? (
                                              <div className="VoteContainer">
                                                <div id={`VoteUp${data.id}`}>
                                                  <UpVote
                                                    onClick={() => {
                                                      Vote(
                                                        data.id,
                                                        "up",
                                                        data.rank
                                                      );
                                                    }}
                                                    size={40}
                                                    className={
                                                      GetVoteColorUp(data.id)
                                                        ? "VoteActive"
                                                        : "VoteInactive"
                                                    }
                                                  />
                                                </div>
                                                <div className="RankContainer">
                                                  <h1
                                                    style={
                                                      data.rank < 0
                                                        ? { color: "#FF0000" }
                                                        : { color: "#000000" }
                                                    }
                                                  >
                                                    {data.rank}
                                                  </h1>
                                                </div>
                                                <div id={`VoteDown${data.id}`}>
                                                  <DownVote
                                                    onClick={() =>
                                                      Vote(
                                                        data.id,
                                                        "down",
                                                        data.rank
                                                      )
                                                    }
                                                    size={40}
                                                    className={
                                                      GetVoteColorDown(data.id)
                                                        ? "VoteActive"
                                                        : "VoteInactive"
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="VoteContainer">
                                                <div>
                                                  <UpVote
                                                    onClick={() =>
                                                      handleShowRequestLogin()
                                                    }
                                                    size={40}
                                                    color="gray"
                                                  />
                                                </div>
                                                <div className="RankContainer">
                                                  <h1
                                                    style={
                                                      data.rank < 0
                                                        ? { color: "#FF0000" }
                                                        : { color: "#000000" }
                                                    }
                                                  >
                                                    {data.rank}
                                                  </h1>
                                                </div>
                                                <div>
                                                  <DownVote
                                                    onClick={() =>
                                                      handleShowRequestLogin()
                                                    }
                                                    size={40}
                                                    color="gray"
                                                  />
                                                </div>
                                              </div>
                                            )}
                                          </Col>
                                          <Col align="left">
                                            <div id="Part">
                                              <h3>{data.title}</h3>
                                            </div>
                                          </Col>
                                          <Col align="right">
                                            <div id="notPart" size="sm">
                                              <div id="notPart" size="sm">
                                                <OverlayTrigger
                                                  id={data.id}
                                                  key={data.id}
                                                  sm={4}
                                                  overlay={ShowName(
                                                    data.id,
                                                    data.ownerName
                                                  )}
                                                >
                                                  <Image
                                                    src={data.photoURL}
                                                    roundedCircle
                                                    fluid
                                                    className="avatarResource"
                                                  ></Image>
                                                </OverlayTrigger>
                                              </div>
                                              <div
                                                id="notPart"
                                                align="right"
                                                size="sm"
                                              >
                                                {data.date
                                                  .toDate()
                                                  .toLocaleDateString("en-EN", {
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                  })}
                                              </div>
                                            </div>
                                          </Col>
                                        </Row>
                                      </Card.Header>
                                      <Card.Body>
                                        <Row>
                                          <Col>
                                            <div align="left" id="Part">
                                              <Markdown>
                                                {convertText(data.body)}
                                              </Markdown>
                                            </div>
                                          </Col>
                                          {sessionStorage.getItem("ID") !==
                                            null &&
                                          sessionStorage.getItem("ID") !==
                                            "" ? (
                                            (data.owner ===
                                              sessionStorage.getItem("ID") &&
                                              Date.now() -
                                                data.date.toDate().getTime() <
                                                process.env
                                                  .REACT_APP_EDIT_ARCHIVE_RESOURCE_TIMEALERT) ||
                                            props.conceptOwner ===
                                              sessionStorage.getItem("ID") ? (
                                              <>
                                                <Col>
                                                  <div
                                                    align="right"
                                                    id="notPart"
                                                  >
                                                    <Button
                                                      className="Button"
                                                      variant="outline-secondary"
                                                      onClick={() =>
                                                        ArchiveResource(
                                                          data.title,
                                                          data.id
                                                        )
                                                      }
                                                    >
                                                      Archive
                                                    </Button>
                                                    <Button
                                                      className="Button"
                                                      variant="primary"
                                                      onClick={() =>
                                                        ShowModalFromEdit(
                                                          data.id
                                                        )
                                                      }
                                                    >
                                                      Edit
                                                    </Button>
                                                  </div>
                                                </Col>
                                              </>
                                            ) : (
                                              <></>
                                            )
                                          ) : (
                                            <></>
                                          )}
                                        </Row>
                                        <hr />
                                        <div align="left" id="NotPart">
                                          {Languages[data.language]}
                                        </div>
                                      </Card.Body>
                                    </Card>
                                    <ShowComments
                                      DataConcept={props.DataConcept}
                                      DataOrg={props.DataOrg}
                                      resourceID={data.id}
                                      orgID={props.id}
                                      conceptID={conceptID}
                                    />
                                  </Col>
                                </Row>
                                <br />
                              </li>
                            </div>
                          </div>
                        )) //end of map
                      }
                    </>
                  ) : (
                    <>
                      <div>
                        {languageAvailableInfo === false ? (
                          <div align="center">
                            <h4>
                              There are no{" "}
                              {props.DataOrg.resourceP.toLowerCase()} on your
                              default language yet, create one or check them on
                              the following languages:
                            </h4>
                            <Container align="left">
                              <ListGroup>
                                {resourceCount.map((info) => (
                                  <ListGroup.Item
                                    key={info.language}
                                    onClick={() =>
                                      ChangeLanguage(info.language)
                                    }
                                    action
                                  >
                                    <b>{Languages[info.language]}</b>: {info.N}
                                    {info.N > 1 ? (
                                      <>{" resources."}</>
                                    ) : (
                                      <>{" resource."}</>
                                    )}
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            </Container>
                          </div>
                        ) : (
                          <>
                            {
                              props.data.map((data) => (
                                <div key={data.id}>
                                  {data.language.substr(0, 2) ===
                                  props.language.substr(0, 2) ? (
                                    <div
                                      tabIndex="0"
                                      id={data.id}
                                      onAnimationEnd={ClearClass}
                                    >
                                      <li key={data.id} tabIndex="0">
                                        <Row className="justify-content-md-center">
                                          <Col>
                                            <Card
                                              style={{ color: "#000" }}
                                              id={data.id}
                                            >
                                              <Card.Header>
                                                <Row>
                                                  <Col as="div" md="auto">
                                                    {sessionStorage.getItem(
                                                      "ID"
                                                    ) !== null &&
                                                    sessionStorage.getItem(
                                                      "ID"
                                                    ) !== "" ? (
                                                      <div className="VoteContainer">
                                                        <div
                                                          id={`VoteUp${data.id}`}
                                                        >
                                                          <UpVote
                                                            onClick={() => {
                                                              Vote(
                                                                data.id,
                                                                "up",
                                                                data.rank
                                                              );
                                                            }}
                                                            size={40}
                                                            className={
                                                              GetVoteColorUp(
                                                                data.id
                                                              )
                                                                ? "VoteActive"
                                                                : "VoteInactive"
                                                            }
                                                          />
                                                        </div>
                                                        <div className="RankContainer">
                                                          <h1
                                                            style={
                                                              data.rank < 0
                                                                ? {
                                                                    color:
                                                                      "#FF0000",
                                                                  }
                                                                : {
                                                                    color:
                                                                      "#000000",
                                                                  }
                                                            }
                                                          >
                                                            {data.rank}
                                                          </h1>
                                                        </div>
                                                        <div
                                                          id={`VoteDown${data.id}`}
                                                        >
                                                          <DownVote
                                                            onClick={() =>
                                                              Vote(
                                                                data.id,
                                                                "down",
                                                                data.rank
                                                              )
                                                            }
                                                            size={40}
                                                            className={
                                                              GetVoteColorDown(
                                                                data.id
                                                              )
                                                                ? "VoteActive"
                                                                : "VoteInactive"
                                                            }
                                                          />
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      <div className="VoteContainer">
                                                        <div>
                                                          <UpVote
                                                            onClick={() =>
                                                              handleShowRequestLogin()
                                                            }
                                                            size={40}
                                                            color="gray"
                                                          />
                                                        </div>
                                                        <div className="RankContainer">
                                                          <h1
                                                            style={
                                                              data.rank < 0
                                                                ? {
                                                                    color:
                                                                      "#FF0000",
                                                                  }
                                                                : {
                                                                    color:
                                                                      "#000000",
                                                                  }
                                                            }
                                                          >
                                                            {data.rank}
                                                          </h1>
                                                        </div>
                                                        <div>
                                                          <DownVote
                                                            onClick={() =>
                                                              handleShowRequestLogin()
                                                            }
                                                            size={40}
                                                            color="gray"
                                                          />
                                                        </div>
                                                      </div>
                                                    )}
                                                  </Col>
                                                  <Col align="left">
                                                    <div id="Part">
                                                      <h3>{data.title}</h3>
                                                    </div>
                                                  </Col>
                                                  <Col align="right">
                                                    <div id="notPart" size="sm">
                                                      <div
                                                        id="notPart"
                                                        size="sm"
                                                      >
                                                        <OverlayTrigger
                                                          id={data.id}
                                                          key={data.id}
                                                          sm={4}
                                                          overlay={ShowName(
                                                            data.id,
                                                            data.ownerName
                                                          )}
                                                        >
                                                          <Image
                                                            src={data.photoURL}
                                                            roundedCircle
                                                            fluid
                                                            className="avatarResource"
                                                          ></Image>
                                                        </OverlayTrigger>
                                                      </div>
                                                      <div
                                                        id="notPart"
                                                        align="right"
                                                        size="sm"
                                                      >
                                                        {data.date
                                                          .toDate()
                                                          .toLocaleDateString(
                                                            "en-EN",
                                                            {
                                                              hour: "numeric",
                                                              minute: "numeric",
                                                            }
                                                          )}
                                                      </div>
                                                    </div>
                                                  </Col>
                                                </Row>
                                              </Card.Header>
                                              <Card.Body>
                                                <Row>
                                                  <Col>
                                                    <div align="left" id="Part">
                                                      <Markdown>
                                                        {convertText(data.body)}
                                                      </Markdown>
                                                    </div>
                                                  </Col>
                                                  {sessionStorage.getItem(
                                                    "ID"
                                                  ) !== null &&
                                                  sessionStorage.getItem(
                                                    "ID"
                                                  ) !== "" ? (
                                                    (data.owner ===
                                                      sessionStorage.getItem(
                                                        "ID"
                                                      ) &&
                                                      Date.now() -
                                                        data.date
                                                          .toDate()
                                                          .getTime() <
                                                        process.env
                                                          .REACT_APP_EDIT_ARCHIVE_RESOURCE_TIMEALERT) ||
                                                    props.conceptOwner ===
                                                      sessionStorage.getItem(
                                                        "ID"
                                                      ) ? (
                                                      <>
                                                        <Col>
                                                          <div
                                                            align="right"
                                                            id="notPart"
                                                          >
                                                            <Button
                                                              className="Button"
                                                              variant="outline-secondary"
                                                              onClick={() =>
                                                                ArchiveResource(
                                                                  data.title,
                                                                  data.id
                                                                )
                                                              }
                                                            >
                                                              Archive
                                                            </Button>
                                                            <Button
                                                              className="Button"
                                                              variant="primary"
                                                              onClick={() =>
                                                                ShowModalFromEdit(
                                                                  data.id
                                                                )
                                                              }
                                                            >
                                                              Edit
                                                            </Button>
                                                          </div>
                                                        </Col>
                                                      </>
                                                    ) : (
                                                      <></>
                                                    )
                                                  ) : (
                                                    <></>
                                                  )}
                                                </Row>
                                                <hr />
                                                <div align="left" id="NotPart">
                                                  {Languages[data.language]}
                                                </div>
                                              </Card.Body>
                                            </Card>
                                            <ShowComments
                                              DataConcept={props.DataConcept}
                                              DataOrg={props.DataOrg}
                                              resourceID={data.id}
                                              orgID={props.id}
                                              conceptID={conceptID}
                                            />
                                          </Col>
                                        </Row>
                                        <br />
                                      </li>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              )) //end of map
                            }
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </ul>
            </Container>
          </>
        )}
      </div>
      <ArchiveModalConfirm
        id={props.DataOrg.id}
        conceptId={idArchive}
        resourceID={resourceIDArchive}
        name={name}
        title={conceptTitle}
        showArchive={showArchive}
        handleCloseArchive={handleCloseArchive}
      />
      <RequestLogin
        showRequestLogin={showRequestLogin}
        handleCloseRequestLogin={handleCloseRequestLogin}
      />
    </>
  );
};

export default ShowResources;
