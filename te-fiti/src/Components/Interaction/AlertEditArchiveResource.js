import React from "react";
import { Alert } from "react-bootstrap";

const AlertResource = (props) => {
  return (
    <Alert
      variant="warning"
      show={props.show}
      onClose={() => props.close(false)}
      dismissible
    >
      <Alert.Heading>Edit and archive alert</Alert.Heading>
      <p>
        You have 1 hour to edit or archive your recently created{" "}
        {props.resourceNoun.toLowerCase()}.
      </p>
    </Alert>
  );
};

export default AlertResource;
