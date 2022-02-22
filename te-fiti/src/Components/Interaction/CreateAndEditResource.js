import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import LanguageListComplete from "./LanguageSelectResource";
import { db } from "../../firebase";

const ModalResource = (props) => {
  const [language, setLanguage] = useState(window.navigator.language);

  const initialState = {
    title: "",
    body: "",
    language: window.navigator.language,
    owner: "",
    ownerName: "",
    photoURL: "",
    date: "",
    archive: false,
    rank: 0, //There will be positives and negatives votes?
  };

  const [values, setValue] = useState(initialState);
  const [validated, setValidated] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValue({ ...values, [name]: value });
  };

  const ShowMessage = () => {
    //if the user that created the current resources is different of the concept owner show the message
    if (sessionStorage.getItem("ID") !== props.conceptOwner) {
      props.setShowMessage(true);
    }
  };

  const IsValidated = () => {
    if (values.title !== "" && values.body !== "") {
      return true;
    } else {
      return false;
    }
  };

  const hSubmit = (event) => {
    event.preventDefault();
    values.language = language;
    let button = document.getElementById("buttonCreate").value;
    if (IsValidated()) {
      if (button === "Create") {
        document.getElementById("buttonCreate").setAttribute("disabled", true);
        document.getElementById("Close").setAttribute("disabled", true);
        setValidated(false);
        handledSubmit();
      } else {
        setValidated(false);
        handleEdit();
      }
    } else {
      setValidated(true);
    }
  };

  const handleEdit = async () => {
    await db
      .collection("organization")
      .doc(props.orgID)
      .collection("concepts")
      .doc(props.conceptID)
      .collection("resources")
      .doc(props.resourceID)
      .update(values)
      .then(() => {
        setValue(initialState);
        props.setButtonText("Create");
        props.handleClose();
      });
  };

  const handledSubmit = () => {
    values.date = new Date(Date.now());
    props.setButtonText("Creating...");
    //with cloud firestore
    db.collection("organization")
      .doc(props.orgID)
      .collection("concepts")
      .doc(props.conceptID)
      .collection("resources")
      .add({
        title: values.title,
        body: values.body,
        language: values.language,
        owner: sessionStorage.getItem("ID"),
        ownerName: sessionStorage.getItem("user"),
        photoURL: sessionStorage.getItem("avatar"),
        date: new Date(Date.now()),
        archive: false,
        rank: 0,
      })
      .then(() => {
        setValue(initialState);
        ShowMessage();
        UpdateResourceAmount();
        props.setButtonText("Create");
        props.handleClose();
      });
  };

  const UpdateResourceAmount = async () => {
    await db
      .collection("organization")
      .doc(props.orgID)
      .collection("concepts")
      .doc(props.conceptID)
      .get()
      .then((doc) => {
        db.collection("organization")
          .doc(props.orgID)
          .collection("concepts")
          .doc(props.conceptID)
          .update({
            resourceAmount: doc.data().resourceAmount + 1,
          });
      });
  };

  const CloseModal = () => {
    setLanguage(window.navigator.language);
    setValidated(false);
    props.onHide();
  };

  const GetInfo = async () => {
    if (
      props.conceptID !== "" &&
      props.conceptID !== undefined &&
      props.orgID !== "" &&
      props.orgID !== undefined &&
      props.resourceID !== "" &&
      props.resourceID !== undefined
    ) {
      await db
        .collection("organization")
        .doc(props.orgID)
        .collection("concepts")
        .doc(props.conceptID)
        .collection("resources")
        .doc(props.resourceID)
        .get()
        .then((doc) => {
          setValue({
            ...doc.data(),
          });
        });
    } else {
      setValue(initialState);
    }
  };

  //to listen when the value change and the update it.
  useEffect(() => {
    setLanguage(values.language);
  }, [values.language]);

  useEffect(() => {
    GetInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <div>
      <Modal show={props.show} onHide={props.onHide} onbackdrop={CloseModal}>
        <Modal.Header>
          <Modal.Title>
            {props.titleText} {props.resourceTitle.toLowerCase()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={hSubmit} validated={validated} noValidate>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                name="title"
                id="title"
                type="text"
                placeholder={`Name your ${props.resourceTitle.toLowerCase()}`}
                onChange={handleInputChange}
                value={values.title}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Please provide a title
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Body</Form.Label>
              <Form.Control
                required
                as="textarea"
                type="textarea"
                className="textareaModal"
                placeholder={`Describe your ${props.resourceTitle.toLowerCase()}`}
                onChange={handleInputChange}
                value={values.body}
                name="body"
                id="body"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Please provide a body for your {props.resourceTitle}
              </Form.Control.Feedback>
              <div align="right">
                <a
                  className="Hyperlink"
                  href="https://www.markdownguide.org/basic-syntax/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Markdown help
                </a>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Select a language</Form.Label>
              <br />
              <LanguageListComplete
                language={language}
                setLanguage={setLanguage}
              />
            </Form.Group>
            <div align="right">
              <Button
                className="Button"
                id="Close"
                variant="secondary"
                onClick={() => {
                  CloseModal();
                }}
              >
                Cancel
              </Button>

              <Button
                className="Button"
                id="buttonCreate"
                variant="primary"
                type="submit"
                value={props.buttonText}
                onClick={hSubmit}
              >
                {props.buttonText}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalResource;
