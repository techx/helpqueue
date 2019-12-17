import React from "react";
import { Container, Button } from "reactstrap";
import useLogin from "../hooks/useLogin";

const MentorLoginPage = () => {
  const { redirectToDopeAuth } = useLogin();
  return (
    <Container>
      <p> by: HackMIT</p>

      <Button onClick={redirectToDopeAuth} color="primary">
        Login with DopeAuth
      </Button>
    </Container>
  );
};

export default MentorLoginPage;
