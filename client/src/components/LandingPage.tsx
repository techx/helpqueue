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
        <h2> Blueprint 2023 Help Queue</h2>
        <h4> Presented by: HackMIT</h4>

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
          {isMentor ? null : (
            <Button onClick={() => setIsMentor(m => !m)}>
              Sign up as mentor
            </Button>
          )}
          <Button
            onClick={() => {
              const params: [string, string][] | undefined =
                password.length > 0 ? [["mentor_key", password]] : undefined;
              redirectToDopeAuth(params);
            }}
            color="blue"
          >
            Log in with email
          </Button>
          {!isMentor && settings && settings.github_client_id ? (
            <Button
              href={
                "https://github.com/login/oauth/authorize?client_id=" +
                settings.github_client_id +
                "&scope=user:email"
              }
              color="red"
            >
              Log in with Github
            </Button>
          ) : null}
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
