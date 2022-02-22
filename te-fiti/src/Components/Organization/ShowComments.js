import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase";
import AlertComment from "../Interaction/AlertEditArchiveComment";
import RequestLogin from "../Interaction/RequestLogin";
import ArchiveCommentModal from "../Interaction/ArchiveComment";
import {
  Card,
  Image,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Accordion,
  Form,
  Button,
  Container,
  Spinner,
} from "react-bootstrap";

const ShowComments = (props) => {
  const [comments, setComments] = useState([]);
  const [showArchive, setShowArchive] = useState(false);
  const [activeAlert, setActiveAlert] = useState("");
  const [buttonText, setButtonText] = useState("Save");
  const [showCommentAlert, setShowCommentAlert] = useState(false);
  const [showRequestLogin, setShowRequestLogin] = useState(false);
  const [loadComments, setLoadComments] = useState(true);
  const [savingSpinner, setSavingSpinner] = useState(false);
  const [idCommentToArchive, setIdCommentToArchive] = useState("");
  const [text, setText] = useState("");
  const currentComment = useRef("");

  const ArchiveComment = (title, conceptId) => {
    handleShowArchive(title, conceptId);
  };

  const handleShowArchive = (text, commentID) => {
    setText(text);
    setIdCommentToArchive(commentID);
    setShowArchive(true);
  };

  const handleCloseArchiveComment = () => {
    setShowArchive(false);
  };

  const handleShowRequestLogin = () => {
    setShowRequestLogin(true);
  };

  const handleCloseRequestLogin = () => {
    setShowRequestLogin(false);
  };

  const HideButton = (collapseid) => {
    document
      .getElementById(`AccordionCollapse${collapseid}`)
      .setAttribute("hidden", true);
  };

  const SaveComment = (resourceID) => {
    const TextArea = document.getElementById(`AccordionTextArea${resourceID}`);
    const comment = TextArea.value;
    document.getElementById(`Save${resourceID}`).setAttribute("disabled", true);
    document
      .getElementById(`Close${resourceID}`)
      .setAttribute("disabled", true);
    setButtonText("Saving...");
    setSavingSpinner(true);
    db.collection("organization")
      .doc(props.orgID) //The id of the current organization
      .collection("concepts")
      .doc(props.conceptID) // concept ID get it from the URL
      .collection("resources")
      .doc(resourceID) // resource ID get it from the function on the click button that match with the resource click
      .collection("comments")
      .add({
        author: sessionStorage.getItem("ID"),
        photoAuthor: sessionStorage.getItem("avatar"),
        authorName: sessionStorage.getItem("user"),
        comment: comment,
        date: new Date(Date.now()),
        archive: false,
      })
      .then((docRef) => {
        setSavingSpinner(false);
        const CollapseAll = document.getElementById(`CollapseAll${resourceID}`); //The CollapseAll for the specific resource
        currentComment.current = docRef.id; //A reference to the current comment that we just create
        CloseCollapse(resourceID); //Close the form that we use to type our comment
        //validate that the CollapseAll exist
        if (CollapseAll !== null) {
          // if the comments is more than N number that we want to show just Hide the Show more link because we don't need it
          if (comments.length > process.env.REACT_APP_SHOW_N_COMMENTS) {
            HideShowMore(resourceID);
          } else {
            //Remove the hidden Attribute form the Add Comment Button
            CollapseAll.setAttribute("hidden", false);
            //if the comments is more or iqual to the N number that we want to show, click on the CollapseAll to Show the comments that remains
            if (comments.length >= process.env.REACT_APP_SHOW_N_COMMENTS) {
              CollapseAll.click();
            }
          }
        }
        HighlightComment(currentComment.current); //Highlight the current comment, that is the one that we just create
        // next lines are for return the buttons to their original state
        document
          .getElementById(`Save${resourceID}`)
          .removeAttribute("disabled", false);
        document
          .getElementById(`Close${resourceID}`)
          .removeAttribute("disabled", false);
        setButtonText("Save");
        setActiveAlert(resourceID); //telling to the app in wich resource have to show the alert of comments.
        setShowCommentAlert(true); // set the alert as true to active the alert just in the resource that we need
        setLoadComments(true); //Telling the app to refresh the comment list
      });
  };

  const ClearClass = () => {
    //once the animation of highlight end, the current comment return his className to " ", that means no Class
    const comment = document.getElementById(`comment${currentComment.current}`);
    if (comment !== null && comment !== undefined) {
      comment.className = "";
    }
  };

  const CloseCollapse = (collapseid) => {
    const accordion = document.getElementById(`AccordionCollapse${collapseid}`); //catch the Add comment button to manipulate it.
    const textArea = document.getElementById(`AccordionTextArea${collapseid}`);
    if (accordion !== null) {
      //validate if is null
      accordion.click(); //Click on to hide the form that this button show
      accordion.removeAttribute("hidden", false); //remove the attribute to Show the button add comment
      textArea.value = ""; //cleaning the form to be ready to type again
    }
  };

  const GetComments = () => {
    db.collection("organization")
      .doc(props.orgID)
      .collection("concepts")
      .doc(props.conceptID)
      .collection("resources")
      .doc(props.resourceID)
      .collection("comments")
      .orderBy("date", "asc")
      .onSnapshot((Snapshot) => {
        if (Snapshot.empty) {
        } else {
          const docInfo = []; // here will save the resource object
          Snapshot.forEach((doc) => {
            if (doc.data().archive === false) {
              docInfo.push({ ...doc.data(), id: doc.id });
            }
          });
          //if the docInfo.length is 0 means that there exist a colletion but there are only archive concepts
          setComments(docInfo); //save data on the Data state
        }
      });
  };

  const HideShowMore = (id) => {
    //hide the CollapseAll Link
    document.getElementById(`CollapseAll${id}`).setAttribute("hidden", true);
  };

  const HighlightComment = (commentID) => {
    //set to the current comment the Class "Highlight" to get the animation and the focus after created it.
    const comment = document.getElementById(`comment${commentID}`);
    comment.className = "highlight";
    comment.focus();
  };

  useEffect(() => {
    if (loadComments === true) {
      GetComments();
      setLoadComments(false);
    }
    // eslint-disable-next-line
  }, [loadComments]);

  useEffect(() => {
    setTimeout(() => {
      if (showCommentAlert === true) {
        setActiveAlert("");
        setShowCommentAlert(false);
      }
    }, 10000);
  }, [showCommentAlert]);

  const ShowName = (id, name) => {
    return <Tooltip id={`creator-${id}`}>Created by: {name}</Tooltip>;
  };

  return (
    <>
      <Accordion defaultActiveKey="0">
        {comments.map((data, index) => {
          return (
            <div
              key={data.id}
              tabIndex="0"
              id={`comment${data.id}`}
              onAnimationEnd={ClearClass}
            >
              {index < process.env.REACT_APP_SHOW_N_COMMENTS ? (
                <Accordion defaultActiveKey="0">
                  <div key={data.id}>
                    <Accordion.Collapse id={`Collapse${data.id}`} eventKey="0">
                      <div className="comment">
                        <Card>
                          <Card.Header>
                            <Row>
                              <Col sm={1}>
                                <div align="left">
                                  <OverlayTrigger
                                    key={data.id}
                                    sm={4}
                                    overlay={ShowName(data.id, data.authorName)}
                                  >
                                    <Image
                                      src={data.photoAuthor}
                                      roundedCircle
                                      fluid
                                      className="avatarComment"
                                    />
                                  </OverlayTrigger>
                                </div>
                              </Col>
                              <Col align="right">
                                {data.date
                                  .toDate()
                                  .toLocaleDateString("en-EN", {
                                    hour: "numeric",
                                    minute: "numeric",
                                  })}
                              </Col>
                            </Row>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col>
                                <Card.Text align="left">
                                  {data.comment}
                                </Card.Text>
                              </Col>
                              {(Date.now() - data.date.toDate().getTime() <
                                process.env
                                  .REACT_APP_EDIT_ARCHIVE_COMMENT_TIMEALERT &&
                                data.author === sessionStorage.getItem("ID")) ||
                              sessionStorage.getItem("ID") ===
                                props.DataConcept.owner ? (
                                <>
                                  <Col align="right" sm="auto">
                                    <Button
                                      className="ButtonArchiveComment"
                                      variant="outline-secondary"
                                      onClick={() =>
                                        ArchiveComment(data.comment, data.id)
                                      }
                                    >
                                      Archive
                                    </Button>
                                  </Col>
                                </>
                              ) : (
                                <></>
                              )}
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                    </Accordion.Collapse>
                  </div>
                </Accordion>
              ) : (
                <div key={data.id}>
                  <Accordion.Collapse id={`Collapse${data.id}`} eventKey="1">
                    <div
                      className="comment"
                      tabIndex="0"
                      id={`comment${data.id}`}
                      onAnimationEnd={ClearClass}
                    >
                      <Card>
                        <Card.Header>
                          <Row>
                            <Col sm={1}>
                              <div align="left">
                                <OverlayTrigger
                                  id={data.id}
                                  key={data.id}
                                  sm={4}
                                  overlay={ShowName(data.id, data.authorName)}
                                >
                                  <div>
                                    <Image
                                      src={data.photoAuthor}
                                      roundedCircle
                                      fluid
                                      className="avatarComment"
                                    />
                                  </div>
                                </OverlayTrigger>
                              </div>
                            </Col>
                            <Col align="right">
                              {data.date.toDate().toLocaleDateString("en-EN", {
                                hour: "numeric",
                                minute: "numeric",
                              })}
                            </Col>
                          </Row>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col>
                              <Card.Text align="left">{data.comment}</Card.Text>
                            </Col>
                            {(Date.now() - data.date.toDate().getTime() <
                              process.env
                                .REACT_APP_EDIT_ARCHIVE_COMMENT_TIMEALERT &&
                              data.author === sessionStorage.getItem("ID")) ||
                            sessionStorage.getItem("ID") ===
                              props.DataConcept.owner ? (
                              <>
                                <Col align="right" sm="auto">
                                  <Button
                                    className="ButtonArchiveComment"
                                    variant="outline-secondary"
                                    onClick={() =>
                                      ArchiveComment(data.comment, data.id)
                                    }
                                  >
                                    Archive
                                  </Button>
                                </Col>
                              </>
                            ) : (
                              <></>
                            )}
                          </Row>
                        </Card.Body>
                      </Card>
                    </div>
                  </Accordion.Collapse>
                </div>
              )}
            </div>
          );
        })}
        <Container>
          {activeAlert === props.resourceID &&
          sessionStorage.getItem("ID") !== props.DataConcept.owner ? (
            <AlertComment show={showCommentAlert} close={setShowCommentAlert} />
          ) : null}
        </Container>

        {comments.length <= process.env.REACT_APP_SHOW_N_COMMENTS ? (
          <>
            <Accordion.Collapse eventKey="0">
              <div className="comment" align="left">
                <Accordion>
                  {sessionStorage.getItem("ID") !== null &&
                  sessionStorage.getItem("ID") !== "" ? (
                    <>
                      <Accordion.Toggle
                        as={Button}
                        className="addCommentButton"
                        id={`AccordionCollapse${props.resourceID}`}
                        eventKey="2"
                        onClick={() => {
                          HideButton(props.resourceID);
                        }}
                      >
                        Add Comment
                      </Accordion.Toggle>
                    </>
                  ) : (
                    <>
                      <Accordion.Toggle
                        as={Button}
                        className="addCommentButton"
                        onClick={() => {
                          handleShowRequestLogin();
                        }}
                      >
                        Add Comment
                      </Accordion.Toggle>
                    </>
                  )}
                  {savingSpinner ? (
                    <div align="center">
                      <Spinner animation="grow" variant="primary" />
                      <p>Saving...</p>
                    </div>
                  ) : (
                    <Accordion.Collapse eventKey="2">
                      <Form className="formAddComment">
                        <Form.Group>
                          <Form.Control
                            id={`AccordionTextArea${props.resourceID}`}
                            as="textarea"
                            placeholder="Type your comment"
                          />
                        </Form.Group>
                        <Form.Group align="right">
                          <Button
                            id={`Close${props.resourceID}`}
                            className="Button"
                            variant="secondary"
                            onClick={() => {
                              CloseCollapse(props.resourceID);
                            }}
                          >
                            Close
                          </Button>
                          <Button
                            id={`Save${props.resourceID}`}
                            className="Button"
                            variant="primary"
                            onClick={() => {
                              SaveComment(props.resourceID);
                            }}
                          >
                            {buttonText}
                          </Button>
                        </Form.Group>
                      </Form>
                    </Accordion.Collapse>
                  )}
                </Accordion>
              </div>
            </Accordion.Collapse>
          </>
        ) : (
          <>
            <Accordion.Collapse eventKey="1">
              <div className="comment" align="left">
                <Accordion>
                  {sessionStorage.getItem("ID") !== null &&
                  sessionStorage.getItem("ID") !== "" ? (
                    <>
                      <Accordion.Toggle
                        as={Button}
                        className="addCommentButton"
                        id={`AccordionCollapse${props.resourceID}`}
                        eventKey="2"
                        onClick={() => {
                          HideButton(props.resourceID);
                        }}
                      >
                        Add Comment
                      </Accordion.Toggle>
                    </>
                  ) : (
                    <>
                      <Accordion.Toggle
                        as={Button}
                        className="addCommentButton"
                        onClick={() => {
                          handleShowRequestLogin();
                        }}
                      >
                        Add Comment
                      </Accordion.Toggle>
                    </>
                  )}
                  {savingSpinner ? (
                    <div align="center">
                      <Spinner animation="grow" variant="primary" />
                      <p>Saving...</p>
                    </div>
                  ) : (
                    <Accordion.Collapse eventKey="2">
                      <Form className="formAddComment">
                        <Form.Group>
                          <Form.Control
                            id={`AccordionTextArea${props.resourceID}`}
                            as="textarea"
                            placeholder="Type your comment"
                          />
                        </Form.Group>
                        <Form.Group align="right">
                          <Button
                            id={`Close${props.resourceID}`}
                            className="Button"
                            variant="secondary"
                            onClick={() => {
                              CloseCollapse(props.resourceID);
                            }}
                          >
                            Close
                          </Button>
                          <Button
                            id={`Save${props.resourceID}`}
                            className="Button"
                            variant="primary"
                            onClick={() => {
                              SaveComment(props.resourceID);
                            }}
                          >
                            {buttonText}
                          </Button>
                        </Form.Group>
                      </Form>
                    </Accordion.Collapse>
                  )}
                </Accordion>
              </div>
            </Accordion.Collapse>
          </>
        )}

        <div align="right">
          {comments.length - process.env.REACT_APP_SHOW_N_COMMENTS <= 0 ? (
            <>
              <Accordion.Toggle
                as={Button}
                id={`CollapseAll${props.resourceID}`}
                variant="link"
                eventKey="1"
                onClick={() => {
                  HideShowMore(props.resourceID);
                }}
                hidden
              >
                Show {comments.length - 3} comments more.
              </Accordion.Toggle>
            </>
          ) : (
            <>
              <Accordion.Toggle
                as={Button}
                id={`CollapseAll${props.resourceID}`}
                variant="link"
                eventKey="1"
                onClick={() => {
                  HideShowMore(props.resourceID);
                }}
              >
                Show {comments.length - 3} comments more.
              </Accordion.Toggle>
            </>
          )}
        </div>
      </Accordion>

      <RequestLogin
        showRequestLogin={showRequestLogin}
        handleCloseRequestLogin={handleCloseRequestLogin}
      />

      <ArchiveCommentModal
        showArchive={showArchive}
        handleCloseArchive={handleCloseArchiveComment}
        conceptID={props.DataConcept.id}
        resourceID={props.resourceID}
        commentID={idCommentToArchive}
        comment={text}
        orgID={props.DataOrg.id}
      />
    </>
  );
};

export default ShowComments;
