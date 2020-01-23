import React, { useState } from "react";
import { Container, Button, Input, Card } from "semantic-ui-react";
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
        <h2>{settings ? settings.app_name : null} Help Queue</h2>
        <h4> Presented by: {settings ? settings.app_creator : null}</h4>

        <p>The easy to use help queue system!</p>
        {isMentor ? (
          <Input
            className="m-3"
            label="Mentor Key:"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        ) : null}
        <div>
          <Button onClick={() => setIsMentor(m => !m)}>
            {isMentor ? "I am a student" : "I am a mentor"}
          </Button>
          <Button
            onClick={() => {
              const params: [string, string][] | undefined =
                password.length > 0 ? [["mentor_key", password]] : undefined;
              redirectToDopeAuth(params);
            }}
            color="blue"
          >
            Login with email
          </Button>
        </div>
      </Card>
      <footer className="my-4">
        <p>
          Made with <FontAwesomeIcon icon={faHeart} /> by{" "}
          <a href="https://techx.io">TechX</a> and Open Sourced <br />
          <a href="https://github.com/techx/helpqueue">
            Deploy this for your event!
          </a>
        </p>
      </footer>
    </Container>
  );
};

export default LandingPage;
