import React from "react";
import { Modal, Form, Button, Container } from "react-bootstrap";
import { db } from "../../firebase";

const ArchiveCommentModal = (props) => {
  const handleArchive = async () => {
    await db
      .collection("organization")
      .doc(props.orgID)
      .collection("concepts")
      .doc(props.conceptID)
      .collection("resources")
      .doc(props.resourceID)
      .collection("comments")
      .doc(props.commentID)
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
          <Modal.Title>Archive comment</Modal.Title>
          <hr />
          <Form.Group>
            <Form.Label>This will archive the following comment:</Form.Label>
            <br />
            <Form.Label>"{props.comment}"</Form.Label>
          </Form.Group>
          <Form.Group>
            <Container>
              <Button
                className="ButtonArchive hollow"
                onClick={() => props.handleCloseArchive()}
              >
                No, keep comment.
              </Button>
              <Button
                className="Button"
                onClick={() => {
                  handleArchive();
                }}
                variant="primary"
              >
                Yes, archive comment.
              </Button>
            </Container>
          </Form.Group>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ArchiveCommentModal;
