import React, { useState } from "react";
import ShowOrganization from "./ShowOrganization";
import { db } from "../../firebase";
import { Container } from "react-bootstrap";

const Organization = () => {
  const [data, setData] = useState([]);

  const GetInfo = async () => {
    db.collection("organization")
      .orderBy("title", "asc")
      .onSnapshot((Snapshot) => {
        const docInfo = []; // here will save the organization object
        Snapshot.forEach((doc) => {
          docInfo.push({ ...doc.data(), id: doc.id });
        });
        //function to OrderBy title alphabetically key insensitive
        docInfo.sort(function (a, b) {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          if (titleA > titleB) {
            return 1;
          }
          if (titleA < titleB) {
            return -1;
          }
          return 0;
        });
        setData(docInfo); //save data on the Data state
      });
  };

  return (
    <div className="App">
      <div>
        <br />
        <Container>
          <ShowOrganization GetInfo={GetInfo} data={data} />
        </Container>
      </div>
    </div>
  );
};

export default Organization;
