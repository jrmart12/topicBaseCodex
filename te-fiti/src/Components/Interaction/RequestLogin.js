import React from "react";
import { Modal, Form, Button, Container } from "react-bootstrap";
import { SignIn } from "../../authentication/firebaseutils";

const RequestLogin = (props) => {
  return (
    <>
      <Modal
        centered
        show={props.showRequestLogin}
        onHide={props.handleCloseRequestLogin}
      >
        <Modal.Header>
          <Modal.Title>Please Login</Modal.Title>
        </Modal.Header>
        <Modal.Body align="center">
          <Form>
            <Form.Group>
              <Form.Label>You need to log in first</Form.Label>
            </Form.Group>
            <Form.Group>
              <Container>
                <Button
                  className="Button"
                  onClick={() => props.handleCloseRequestLogin()}
                  variant="outline-dark"
                >
                  Close
                </Button>
                <Button className="Button" onClick={SignIn} variant="primary">
                  Log In
                </Button>
              </Container>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RequestLogin;
