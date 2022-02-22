import React from "react";
import { Modal, Form, Button, Container } from "react-bootstrap";
import { db } from "../../firebase";

const ArchiveModalConfirm = (props) => {
  const handleArchive = async () => {
    await db
      .collection("organization")
      .doc(props.id)
      .collection("concepts")
      .doc(props.conceptId)
      .update({
        archive: true,
      })
      .then(() => {
        props.handleCloseArchive();
      });
  };

  return (
    <>
      <Modal
        centered
        show={props.showArchive}
        onHide={props.handleCloseArchive}
        size="lg"
      >
        <Modal.Body align="center">
          <Modal.Title>Archive {props.name.toLowerCase()}</Modal.Title>
          <hr />
          <Form.Group>
            <Form.Label>
              This will archive the following {props.name.toLowerCase()}:
            </Form.Label>
            <Form.Label as="h1">{props.title}</Form.Label>
          </Form.Group>
          <Form.Group>
            <Container>
              <Button
                className="ButtonArchive hollow"
                onClick={() => props.handleCloseArchive()}
              >
                No, Keep {props.name}
              </Button>
              <Button
                className="Button"
                onClick={() => {
                  handleArchive();
                }}
                variant="primary"
              >
                Yes, Archive {props.name}
              </Button>
            </Container>
          </Form.Group>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ArchiveModalConfirm;
