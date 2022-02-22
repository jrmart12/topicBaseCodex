import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { db } from "../../firebase";
import { SketchPicker as Color } from "react-color";

const CreateEditOrganization = (props) => {
  const initialState = {
    title: "",
    description: "",
    conceptS: "",
    conceptP: "",
    resourceS: "",
    resourceP: "",
    logoURL: "",
    colorHEX: "#17a2b8",
    slug: "",
  };

  const [values, setValue] = useState(initialState);
  const [validated, setValidated] = useState(false);
  const [color, setColor] = useState("#17a2b8");
  const [colorPickerShow, setColorPickerShow] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertFlag, setAlertFlag] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValue({ ...values, [name]: value });
  };

  const ValidateSlug = () => {
    let regularExpresion = /^([a-zA-Z0-9_-\s])+$/gi;
    if (regularExpresion) {
      if (regularExpresion.test(values.slug.toString())) {
        return true;
      } else {
        return false;
      }
    }
  };
  const HandledColorText = (e) => {
    const { value } = e.target;
    setColor(value);
    values.colorHEX = value;
  };

  const ShowColorPicker = () => {
    setColorPickerShow(true);
  };

  const HideColorPicker = () => {
    setColorPickerShow(false);
  };

  const HandledColorSelect = (c) => {
    setColor(c.hex);
    values.colorHEX = c.hex;
    // console.log(color);
  };

  const CloseModal = () => {
    setValidated(false);
    HideColorPicker();
    CloseAlertSlug();
    setColor("#17a2b8");
    props.onHide();
  };

  const IsValidated = () => {
    if (
      values.title !== "" &&
      values.conceptS !== "" &&
      values.conceptP !== "" &&
      values.resourceS !== "" &&
      values.resourceP !== "" &&
      values.colorHEX !== "" &&
      values.logoURL !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const IsAvailable = (type) => {
    let promise;
    if (type === "create") {
      promise = new Promise((resolve, reject) => {
        let answer = true;
        db.collection("organization")
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              const d = doc.data();
              //validating that the slug is not already mine
              if (d.slug === values.slug) {
                answer = false;
              }
            });
            resolve(answer);
          });
      });
    } else {
      promise = new Promise((resolve, reject) => {
        let answer = true;
        db.collection("organization")
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              const d = doc.data();
              if (d.slug === values.slug) {
                if (doc.id !== props.id) {
                  answer = false;
                }
              }
            });
            resolve(answer);
          });
      });
    }
    return promise;
  };

  const hSubmit = (event) => {
    event.preventDefault();
    let button = document.getElementById("buttonCreate").value;
    if (IsValidated()) {
      if (ValidateSlug()) {
        if (button === "Create") {
          IsAvailable("create").then((res) => {
            if (res === true) {
              document
                .getElementById("buttonCreate")
                .setAttribute("disabled", true);
              document.getElementById("Close").setAttribute("disabled", true);
              setValidated(false);
              handledSubmit();
            } else {
              setAlertText("The slug you write is already used.");
              setAlertFlag(true);
              setValidated(true);
              //alert("The slug you write is already used");
            }
          });
        } else {
          IsAvailable("edit").then((res) => {
            if (res === true) {
              setValidated(false);
              handleEdit();
            } else {
              setAlertText(
                "The current slug is unavailable, please write another one."
              );
              setAlertFlag(true);
              setValidated(true);
              /*alert(
                "The current slug is unavailable, please write another one"
              );*/
            }
          });
        }
      } else {
        setAlertText("English only \rNo special characters allowed.");
        setAlertFlag(true);
        setValidated(true);
        //alert("English only \rNo special characters allowed");
      }
    } else {
      setValidated(true);
    }
  };

  const CloseAlertSlug = () => {
    setAlertFlag(false);
  };

  const handleEdit = async () => {
    values.slug = values.slug.replace(/ /gi, "-");
    values.colorHEX = color;
    await db
      .collection("organization")
      .doc(props.id)
      .update(values)
      .then(() => {
        setValue(initialState);
        props.setButtonText("Create");
        HideColorPicker();
        CloseAlertSlug();
        props.onHide();
      });
  };

  const handledSubmit = () => {
    console.log("create organization");
    props.setButtonText("Creating...");
    //with cloud firestore
    db.collection("organization")
      .add({
        title: values.title,
        description: values.description,
        conceptS: values.conceptS,
        conceptP: values.conceptP,
        resourceS: values.resourceS,
        resourceP: values.resourceP,
        logoURL: values.logoURL,
        colorHEX: color,
        slug: values.slug.replace(/ /gi, "-"),
        archive: false,
      })
      .then((docRef) => {
        addOwner(docRef);
        CloseAlertSlug();
        HideColorPicker();
      });
  };

  const addOwner = async (docRef) => {
    await db
      .collection("owners")
      .add({
        orgID: docRef.id,
        owner: sessionStorage.getItem("ID"),
      })
      .then(() => {
        setValue(initialState);
        props.setButtonText("Create");
        props.onHide();
      });
  };

  const GetInfoFromId = async () => {
    if (props.id !== "" && props.id !== undefined) {
      const doc = await db.collection("organization").doc(props.id).get();
      setValue({ ...doc.data() });
      setColor(doc.data().colorHEX);
    } else {
      setValue(initialState);
    }
  };

  useEffect(() => {
    GetInfoFromId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <Modal
      show={props.show}
      onHide={CloseModal}
      scrollable
      onMouseLeave={() => HideColorPicker()}
    >
      <Modal.Header>
        <Modal.Title>{props.titleText} Organization</Modal.Title>
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
              placeholder="Name your organization"
              onChange={handleInputChange}
              value={values.title}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide a title.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              as="textarea"
              type="textarea"
              placeholder="Description"
              onChange={handleInputChange}
              value={values.description}
              name="description"
              id="description"
            />
          </Form.Group>
          <hr />
          <Form.Group>
            <Form.Label as="h5">
              What we will call the concept name (noun)?
            </Form.Label>
            <Form.Label>Singular</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="example: Query, Color"
              onChange={handleInputChange}
              value={values.conceptS}
              name="conceptS"
              id="conceptS"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide a singular concept.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Plural</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="example: Queries, Colors"
              onChange={handleInputChange}
              value={values.conceptP}
              name="conceptP"
              id="conceptP"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide a plural concept.
            </Form.Control.Feedback>
          </Form.Group>
          <hr />
          <Form.Group>
            <Form.Label as="h5">
              What we will call the resource name (noun)?
            </Form.Label>
            <Form.Label>Singular</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="example: Location, Video"
              onChange={handleInputChange}
              value={values.resourceS}
              name="resourceS"
              id="resourceS"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide a singular noun to your resources.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Plural</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="example: Locations, Videos"
              onChange={handleInputChange}
              value={values.resourceP}
              name="resourceP"
              id="resourceP"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide a plural noun to your resources.
            </Form.Control.Feedback>
          </Form.Group>
          <hr />
          <Form.Group>
            <Form.Label>Logo</Form.Label>
            <Form.Control
              required
              name="logoURL"
              id="logoURL"
              type="text"
              placeholder="Provide a URL to your Logo"
              onChange={handleInputChange}
              value={values.logoURL}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide an URL to your Logo.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Select A Color to your Organization</Form.Label>
            <Form.Control
              required
              name="colorHEX"
              id="colorHEX"
              value={color}
              onChange={HandledColorText}
              onClick={() => ShowColorPicker()}
            />

            {colorPickerShow === true ? (
              <div className="colorPicker">
                <div className="cover" onClick={() => HideColorPicker()} />
                <Color
                  disableAlpha
                  name="colorHEX"
                  id="colorHEX"
                  color={values.colorHEX}
                  onChange={HandledColorSelect}
                />
              </div>
            ) : null}

            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <hr />
          <Form.Group>
            <Form.Label>Slug</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Your personal mark"
              onChange={handleInputChange}
              value={values.slug.replace(/ /gi, "-")}
              name="slug"
              id="slug"
            />
            {alertFlag === true ? (
              <>
                <Alert
                  className="AlertSlug"
                  show={alertFlag}
                  dismissible
                  variant="danger"
                  onClose={() => CloseAlertSlug()}
                >
                  {alertText}
                </Alert>
              </>
            ) : (
              <>
                <Form.Control.Feedback>English Only!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  <p>
                    Please provide a slug to your organization
                    <br />
                    No special characters like the following allowed: '%$#@&*/'
                    <br />
                    No letter like the following allowed: ñ,Ñ,á
                  </p>
                </Form.Control.Feedback>
              </>
            )}
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
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default CreateEditOrganization;
