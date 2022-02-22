import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "../../firebase";

const ModalConcepts = (props) => {
  const initialState = {
    title: "",
    description: "",
    tags: "",
    owner: "",
    ownerName: "",
    photoURL: "",
    resourceAmount: 0,
  };

  const [values, setValue] = useState(initialState);
  const [validated, setValidated] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValue({ ...values, [name]: value });
  };

  const CloseModal = () => {
    setValidated(false);
    props.onHide();
  };

  const IsValidated = () => {
    if (
      values.title !== "" &&
      values.description !== "" &&
      values.tags !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const hSubmit = (event) => {
    event.preventDefault();
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
      .doc(props.id)
      .collection("concepts")
      .doc(props.conceptId)
      .update(values)
      .then(() => {
        setValue(initialState);
        props.setButtonText("Create");
        props.setConceptId("");
        props.handleClose();
      });
  };

  const handledSubmit = () => {
    props.setButtonText("Creating...");
    //with cloud firestore
    db.collection("organization")
      .doc(props.id)
      .collection("concepts")
      .add({
        title: values.title,
        description: values.description,
        tags: values.tags,
        owner: sessionStorage.getItem("ID"),
        ownerName: sessionStorage.getItem("user"),
        photoURL: sessionStorage.getItem("avatar"),
        archive: false,
        resourceAmount: values.resourceAmount,
      })
      .then(() => {
        setValue(initialState);
        props.setButtonText("Create");
        props.handleClose();
      });
  };

  const GetInfo = async () => {
    if (
      props.conceptId !== "" &&
      props.conceptId !== undefined &&
      props.id !== "" &&
      props.id !== undefined
    ) {
      const doc = await db
        .collection("organization")
        .doc(props.id)
        .collection("concepts")
        .doc(props.conceptId)
        .get();
      setValue({
        ...doc.data(),
      });
    } else {
      setValue(initialState);
    }
  };

  useEffect(() => {
    GetInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <Modal show={props.show} onHide={props.onHide} onbackdrop={CloseModal}>
      <Modal.Header>
        <Modal.Title>
          {props.titleText} {props.conceptTitle.toLowerCase()}
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
              placeholder={`Name your ${props.conceptTitle.toLowerCase()}`}
              onChange={handleInputChange}
              value={values.title}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide a title
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              required
              as="textarea"
              type="textarea"
              className="textareaModal"
              placeholder="Description"
              onChange={handleInputChange}
              value={values.description}
              name="description"
              id="description"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide a description for your concept
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
          <hr />
          <Form.Group>
            <Form.Label as="h5">Tags</Form.Label>
          </Form.Group>
          <Form.Group>
            <Form.Control
              required
              type="text"
              placeholder="Tags"
              onChange={handleInputChange}
              value={values.tags}
              name="tags"
              id="tags"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide at least one tag
            </Form.Control.Feedback>
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
  );
};

export default ModalConcepts;
