import React, { useState } from "react";
import {
  Container,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from "reactstrap";
import useLogin from "../hooks/useLogin";
import useViewer from "../hooks/useViewer";
import { RouteComponentProps } from "react-router";

const LandingPage = (props: RouteComponentProps) => {
  const { redirectToDopeAuth } = useLogin();
  const { settings } = useViewer();
  const search = new URLSearchParams(props.location.search);

  const [password, setPassword] = useState(search.get("key") || "");
  const [isMentor, setIsMentor] = useState(password.length > 0);

  return (
    <Container>
      <h1>{settings ? settings.app_name : null} Help LIFO</h1>
      <p> brought to you by: {settings ? settings.app_creator : null}</p>

      <p>The help queue system!</p>

      {isMentor ? (
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>Mentor Key:</InputGroupText>
          </InputGroupAddon>
          <Input value={password} onChange={e => setPassword(e.target.value)} />
        </InputGroup>
      ) : null}

      <Button onClick={() => setIsMentor(m => !m)}>
        {isMentor ? "I am a student" : "I am a mentor"}
      </Button>

      <Button
        onClick={() => {
          const params: [string, string][] | undefined =
            password.length > 0 ? [["mentor_key", password]] : undefined;
          redirectToDopeAuth(params);
        }}
        color="primary"
      >
        Login with DopeAuth
      </Button>
    </Container>
  );
};

export default LandingPage;
