import React, { useEffect } from "react";
import Organization from "../Organization/Organization";

const Home = (props) => {
  useEffect(() => {
    props.setOrgLogo("");
    props.setOrgColor("#17a2b8");
    props.setOrgName("Te-Fiti");
  });
  return (
    <div className="App">
      <div>
        <Organization />
      </div>
    </div>
  );
};

export default Home;
