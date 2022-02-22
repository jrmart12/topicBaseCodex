import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const OrganizationPage = (props) => {
  let { idOrg, slug } = useParams();
  return (
    <div>
      {props.user !== "" && props.user !== undefined ? (
        <>
          <div>
            <h1>
              This Page will show the info of the organization named as = {slug}
            </h1>
            <br />
            <h1>With the Code = {idOrg}</h1>
          </div>
          <div>
            <Link to="/organization">
              <Button className="Button"> Go Back </Button>
            </Link>
          </div>
        </>
      ) : (
        <p>Public information</p>
      )}
    </div>
  );
};

export default OrganizationPage;
