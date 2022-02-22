import React from "react";
import { Alert } from "react-bootstrap";

const AlertComment = (props) => {
  return (
    <Alert
      variant="warning"
      show={props.show}
      onClose={() => props.close(false)}
      dismissible
    >
      You have 1 hour to archive your recent comment.
    </Alert>
  );
};

export default AlertComment;
