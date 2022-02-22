import React from "react";
import CreateEditOrganization from "./CreateEditOrganization";
import { Card, Button } from "react-bootstrap";

const ShowOrganization = (props) => {
  const ShowModalFromEdit = (id) => {
    props.setTitleText("Save");
    props.setButtonText("Save");
    props.setId(id);
    props.handleShow();
  };

  return (
    <div className="App">
      <>
        {props.orgExist ? (
          <>
            {props.data.map((data) => (
              <div className="col-md-200" key={data.id}>
                <Card style={{ color: "#000" }}>
                  <Card.Header as="h3" align="left">
                    {data.title}
                  </Card.Header>
                  <Card.Body>
                    <div align="left">{data.description}</div>
                    <div align="right">
                      <Button
                        className="Button"
                        variant="info"
                        onClick={() => ShowModalFromEdit(data.id)}
                      >
                        Edit
                      </Button>

                      <hr />
                    </div>
                  </Card.Body>
                </Card>
                <br />
              </div>
            ))}
          </>
        ) : (
          <>
            <h2>There are no organization yet, create one.</h2>
          </>
        )}
      </>

      <CreateEditOrganization id={props.id} />
    </div>
  );
};

export default ShowOrganization;
