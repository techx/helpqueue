import React, { useState } from "react";
import {
  Container,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Card,
  CardBody,
  CardTitle,
  Row
} from "reactstrap";
import useLogin from "../hooks/useLogin";
import useViewer from "../hooks/useViewer";
import { RouteComponentProps } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const LandingPage = (props: RouteComponentProps) => {
  const { redirectToDopeAuth } = useLogin();
  const { settings } = useViewer();
  const search = new URLSearchParams(props.location.search);

  const [password, setPassword] = useState(search.get("key") || "");
  const [isMentor, setIsMentor] = useState(password.length > 0);

  return (
    <Container>
      <Card>
        <CardBody>
          <CardTitle>
            <h1>{settings ? settings.app_name : null} Help LIFO</h1>
          </CardTitle>
          <h4> Presented by: {settings ? settings.app_creator : null}</h4>

          <p>The easy to use help queue system!</p>
          <h4>Login:</h4>
          <Row>
            {isMentor ? (
              <InputGroup className="my-2">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Mentor Key:</InputGroupText>
                </InputGroupAddon>
                <Input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </InputGroup>
            ) : null}
          </Row>

          <Row className="row justify-content-around">
            <Button onClick={() => setIsMentor(m => !m)} className="col-6">
              {isMentor ? "I am a student" : "I am a mentor"}
            </Button>
            <Button
              onClick={() => {
                const params: [string, string][] | undefined =
                  password.length > 0 ? [["mentor_key", password]] : undefined;
                redirectToDopeAuth(params);
              }}
              className="col-6"
              color="primary"
            >
              Login with DopeAuth
            </Button>
          </Row>
        </CardBody>
      </Card>
      <footer className="my-4">
        <p>
          Made with <FontAwesomeIcon icon={faHeart} /> by{" "}
          <a href="https://techx.io">TechX</a> and Open Sourced <br />
          <a href="https://github.com/techx/helplifo">
            Deploy this for your event!
          </a>
        </p>
      </footer>
    </Container>
  );
};

export default LandingPage;
