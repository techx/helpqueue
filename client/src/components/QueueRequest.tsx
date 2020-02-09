import React, { useEffect, useState } from "react";
// @ts-ignore
import Rate from "rc-rate";
import "rc-rate/assets/index.css";
import {
  Container,
  Button,
  Input,
  Card,
  Form,
  Label,
  Message,
  TextArea,
  Header,
  MessageHeader
} from "semantic-ui-react";
import { Row, Col } from "reactstrap";
import useLogin from "../hooks/useLogin";
import ServerHelper, { ServerURL } from "./ServerHelper";
import useViewer from "../hooks/useViewer";
import { Ticket, User } from "./Types";
import createAlert, { AlertType } from "./Alert";

const QueueRequest = () => {
  const { getCredentials, logout } = useLogin();
  const { settings } = useViewer();
  const { isLoggedIn } = useViewer();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [queueLength, setQueueLength] = useState(0);
  const [cTicketQuestion, setCTicketQuestion] = useState("");
  const [cTicketLocation, setCTicketLocation] = useState("");
  const [cTicketContact, setCTicketContact] = useState("");
  const [cTicketRating, setCTicketRating] = useState(0);
  const getTicket = async () => {
    const res = await ServerHelper.post(ServerURL.userTicket, getCredentials());
    if (res.success) {
      setTicket(res.ticket);
      setUser(res.user);
      setQueueLength(res.queue_position + 1);
    } else {
      setTicket(null);
      if (isLoggedIn) {
        if (
          window.confirm(
            "Your credentials appear to be invalid... Do you want to log out and try again?"
          )
        ) {
          logout();
        }
      }
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
      createAlert(AlertType.Success, "Canceled ticket");
    } else {
      createAlert(AlertType.Error, "Could not cancel ticket");
    }
  };
  const rateTicket = async () => {
    if (ticket == null) {
      return;
    }
    const res = await ServerHelper.post(ServerURL.rateTicket, {
      ...getCredentials(),
      ticket_id: ticket.id,
      rating: cTicketRating
    });
    if (res.success) {
      setTicket(null);
      createAlert(AlertType.Success, "Successfully rated ticket");
    } else {
      createAlert(AlertType.Error, "Could not rate ticket");
    }
  };
  useEffect(() => {
    // On load check to see what the status is of the ticket
    getTicket();

    const interval = setInterval(getTicket, 5000);
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
        <Header as="h1">Welcome to the HelpQueue!</Header>
        {settings && settings.queue_message.length > 0 ? (
          <Message style={{ textAlign: "left" }}>
            <MessageHeader>Announcement:</MessageHeader>
            {settings.queue_message}
          </Message>
        ) : null}
        <h2>How can we help you?</h2>
        <br />
        <Form size={"big"} key={"big"}>
          <Form.Field required style={{ backgroundColor: "#FFD700" }}>
            <label>I need help with...</label>
            <TextArea
              placeholder="describe your problem"
              value={cTicketQuestion}
              onChange={e => setCTicketQuestion(e.currentTarget.value)}
            />
          </Form.Field>
          <Form.Field required>
            <Input
              placeholder="where are you?"
              label="Find me at:"
              value={cTicketLocation}
              onChange={e => setCTicketLocation(e.target.value)}
            />
          </Form.Field>
          <Form.Field style={{ backgroundColor: "#FFD700" }}>
            <Input
              class="ui yellow label"
              label="Reach me at:"
              placeholder="additional contact info i.e. cell/email"
              value={cTicketContact}
              onChange={e => setCTicketContact(e.target.value)}
            />
          </Form.Field>
        </Form>

        <br />
        <Button
          id="CreateTicket"
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
            setCTicketRating(0);
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
          color="blue"
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
        <h2>Waiting for Mentor...</h2>
        <p>
          <b>Position in Queue:</b> {queueLength}
          <br />
          <b>Posted:</b>{" "}
          {ticket.minutes < 3
            ? "a few minutes ago"
            : ticket.minutes + " minutes ago"}
        </p>
        <p>
          <b>Question:</b> {ticket.data.question}
          <br />
          <b>Location:</b> {ticket.data.location}
          <br />
          <b>Contact:</b> {ticket.data.contact}
        </p>
        <Button onClick={cancelTicket} className="col-12" color="red">
          Cancel Ticket
        </Button>
      </>
    );
  } else if (ticket.status == 1) {
    // Claimed
    queueCard = (
      <>
        <h2>You have been claimed!</h2>
        <p>
          <b>Claimed by:</b> {ticket.claimed_by}{" "}
        </p>
        <Button onClick={cancelTicket} className="col-12" color="red">
          Cancel Ticket
        </Button>
      </>
    );
  } else if (ticket.status == 3) {
    // Closed but not yet rated
    queueCard = (
      <>
        <p> The ticket has been closed. </p>
        <p>
          Please rate your mentor (<b>{ticket.claimed_by}</b>)!
        </p>
        <Rate
          defaultValue={0}
          onChange={setCTicketRating}
          style={{ fontSize: 40 }}
          allowClear={true}
        />
        <Button onClick={rateTicket} className="col-12 mt-5" color="green">
          {cTicketRating == 0 ? (
            "Close Ticket"
          ) : (
            <>
              Rating <b>{ticket.claimed_by}</b> {cTicketRating} stars
            </>
          )}
        </Button>
      </>
    );
  } else {
    queueCard = <p> Something went wrong </p>;
  }
  return (
    <Container>
      <Card color="orange">
        <div>
          {user && user.admin_is ? (
            <Button id="AdminPage" href="/admin" color="red" className="my-2">
              Admin Page
            </Button>
          ) : null}
          {user && user.mentor_is ? (
            <Button id="MentorButton" href="/m" className="my-2">
              Mentor Queue
            </Button>
          ) : null}

          {settings && settings.queue_status == "true"
            ? queueCard
            : "The queue is currently closed"}
        </div>
      </Card>
    </Container>
  );
};

export default QueueRequest;
