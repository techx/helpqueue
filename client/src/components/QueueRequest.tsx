import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Input,
  Card,
  CardBody,
  CardTitle,
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import useLogin from "../hooks/useLogin";
import ServerHelper, { ServerURL } from "./ServerHelper";
import useViewer from "../hooks/useViewer";
import { Ticket, User } from "./Types";
import createAlert, { AlertType } from "./Alert";

const QueueRequest = () => {
  const { redirectToDopeAuth, getCredentials } = useLogin();
  const { settings } = useViewer();
  const { isLoggedIn } = useViewer();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [queueLength, setQueueLength] = useState(0);
  const [cTicketQuestion, setCTicketQuestion] = useState("");
  const [cTicketLocation, setCTicketLocation] = useState("");
  const [cTicketContact, setCTicketContact] = useState("");
  const getTicket = async () => {
    const res = await ServerHelper.post(ServerURL.userTicket, getCredentials());
    if (res.success) {
      setTicket(res.ticket);
      setUser(res.user);
      setQueueLength(res.queue_position + 1);
    } else {
      setTicket(null);
    }
  };
  const cancelTicket = async () => {
    if (ticket == null) {
      return;
    }
    const res = await ServerHelper.post(ServerURL.cancelTicket, {
      ...getCredentials(),
      ticket_id: ticket.id
    });
    if (res.success) {
      setTicket(null);
      setCTicketQuestion(ticket.data.question);
    }
  };
  useEffect(() => {
    // On load check to see what the status is of the ticket
    getTicket();

    const interval = setInterval(getTicket, 3000);
    return () => clearInterval(interval);
  }, []);
  if (!isLoggedIn) {
    window.location.href = "/login";
    return null;
  }
  let queueCard = null;
  if (ticket == null) {
    queueCard = (
      <>
        <CardTitle>
          <h2>How can we help you?</h2>
        </CardTitle>
        <Label style={{ display: "block" }}>
          What's your problem?
          <Input
            type="textarea"
            placeholder="describe your problem"
            value={cTicketQuestion}
            onChange={e => setCTicketQuestion(e.target.value)}
          />
        </Label>
        <br />
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>you can find me at</InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="where are you?"
            value={cTicketLocation}
            onChange={e => setCTicketLocation(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>you can reach me at</InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="additional contact info i.e. cell/email"
            value={cTicketContact}
            onChange={e => setCTicketContact(e.target.value)}
          />
        </InputGroup>
        <br />
        <Button
          onClick={async () => {
            if (cTicketQuestion.length === 0) {
              createAlert(AlertType.Warning, "You need to ask a question!");
              return;
            }
            if (cTicketLocation.length === 0) {
              createAlert(
                AlertType.Warning,
                "Please provide a location so a mentor can find you!"
              );
              return;
            }
            const res = await ServerHelper.post(ServerURL.createTicket, {
              ...getCredentials(),
              data: JSON.stringify({
                question: cTicketQuestion,
                location: cTicketLocation,
                contact: cTicketContact.length === 0 ? "N/A" : cTicketContact
              })
            });
            if (res.success) {
              setTicket(res.ticket);
              setCTicketQuestion("");
            }
          }}
          color="primary"
          className="col-12"
        >
          Create Ticket
        </Button>
      </>
    );
  } else if (ticket.status == 0 || ticket.status == 2) {
    // Unclaimed
    queueCard = (
      <>
        <CardTitle><h2>Waiting for Mentor...</h2></CardTitle>
        <p>
        <b>Position in Queue:</b> {queueLength}
        <br/>
          <b>Posted:</b>{' '}
          {ticket.minutes < 3
            ? "few minutes ago"
            : ticket.minutes + " minutes ago"}
        </p>
        <p>
          <b>Question:</b> {ticket.data.question}
          <br />
          <b>Location:</b> {ticket.data.location}
          <br />
          <b>Contact:</b> {ticket.data.contact}
        </p>
        <Button onClick={cancelTicket}
                  className="col-12"
                  color="danger">Cancel Ticket</Button>
      </>
    );
  } else if (ticket.status == 1) {
    queueCard = (
      <>
        <p>You have been claimed by: {ticket.claimed_by} </p>
        <Button onClick={cancelTicket}
                  className="col-12" color="danger">Cancel Ticket</Button>
      </>
    );
  } else {
    queueCard = <p> Something went wrong </p>;
  }
  return (
    <Container>
      <Card>
        <CardBody>
          <CardTitle>
            {user && user.admin_is ? (
              <Button href="/admin" color="info">Admin Page</Button>
            ) : null}
            {user && user.mentor_is ? (
              <Button href="/m" color="success">Mentor Queue</Button>
            ) : null}
          </CardTitle>
          {settings && settings.queue_status == "true"
            ? queueCard
            : "The queue is currently closed"}
        </CardBody>
      </Card>
    </Container>
  );
};

export default QueueRequest;
