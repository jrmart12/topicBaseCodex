import React, { useEffect } from "react";
import { Card, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const ShowOrganization = (props) => {
  useEffect(() => {
    props.GetInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Search = () => {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("SearchInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("OrgList");
    li = ul.getElementsByTagName("li");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      if (a.id === "title") {
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
      }
    }
  };

  return (
    <div className="App">
      <br />
      <Container>
        <Form.Label as="h2">Search on Te-Fiti</Form.Label>
        <Form.Control
          type="text"
          id="SearchInput"
          onKeyUp={Search}
          placeholder="Search Organization"
        ></Form.Control>
      </Container>
      <br />
      <Container>
        <ul id="OrgList">
          {props.data.map((data) => (
            <li key={data.id}>
              <div className="col-md-200" key={data.id}>
                <Card style={{ color: "#000" }}>
                  <Card.Header as="h3" align="left">
                    <Link className="Hyperlink" id="title" to={`/${data.slug}`}>
                      {data.title}
                    </Link>
                  </Card.Header>
                  <Card.Body>
                    <div align="left">{data.description}</div>
                  </Card.Body>
                </Card>
                <br />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
};

export default ShowOrganization;
