import React from "react";
import { Redirect } from "react-router-dom";

const Home = (props) => {
  return (
    <div className="App">
      {props.user !== undefined && props.user !== "" ? (
        <Redirect to="/organization" />
      ) : null}
    </div>
  );
};

export default Home;
