import React, { useCallback, useEffect, useState } from "react";
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
  MessageHeader,
  Select,
} from "semantic-ui-react";
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
  const [cTicketContact, setCTicketContact] = useState("");
  const [cTicketRating, setCTicketRating] = useState(0);
  // const locationOptions = ((settings && settings.locations) || "no location")
  //   .split(",")
  //   .map((l) => ({ key: l, value: l, text: l }));
  const locationOptions = Array.from(Array(80).keys()).map(n => ({ key: "Table " + n, value: "Table " + n, text: "Table " + n }))
  const [cTicketLocation, setCTicketLocation] = useState(
    locationOptions[0].value
  );
  const [cLocation, setCLocation] = useState(
    "Virtual"
  );
  const [canMakeNotification, setCanMakeNotification] = useState(false);

  const getTicket = useCallback(async () => {
    const res = await ServerHelper.post(ServerURL.userTicket, getCredentials());
    if (res.success) {
      const newticket = res.ticket as Ticket | null;
      if (newticket && (newticket.status == 0 || newticket.status == 2)) {
        setCanMakeNotification(true);
      }
      if (newticket && newticket.status == 1 && canMakeNotification) {
        const notification = new Notification("Your ticket has been claimed", {
          body:
            settings &&
            settings.jitsi_link &&
            settings.jitsi_link.includes("://")
              ? "Click to open up your zoom call link"
              : "Don't keep your mentor waiting!",
        });
        notification.onclick = () => {
          if (
            settings &&
            settings.jitsi_link &&
            settings.jitsi_link.includes("://")
          ) {
            window.open(settings.jitsi_link + "/" + newticket.uid);
          }
        };
        setCanMakeNotification(false);
      }
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
  }, [settings, isLoggedIn, canMakeNotification]);
  const cancelTicket = async () => {
    if (ticket == null) {
      return;
    }
    const res = await ServerHelper.post(ServerURL.cancelTicket, {
      ...getCredentials(),
      ticket_id: ticket.id,
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
      rating: cTicketRating,
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
        {settings &&
        settings.queue_message &&
        settings.queue_message.length > 0 ? (
          <Message style={{ textAlign: "left" }}>
            <MessageHeader>Announcement:</MessageHeader>
            {settings.queue_message}
          </Message>
        ) : null}
        <br />
        <Form size={"big"} key={"big"}>
          <Form.Field required>
            <label>I need help with...</label>
            <TextArea
              placeholder="describe your problem"
              value={cTicketQuestion}
              onChange={(e) => setCTicketQuestion(e.currentTarget.value)}
            />
          </Form.Field>
          {/* <Form.Field required>
            <label>Location</label>
            <Select
              value={cLocation}
              options={"Virtual,In Person".split(",").map((l) => ({ key: l, value: l, text: l }))}
              onChange={(_e, data) => setCLocation("" + data.value || "")}
            />
          </Form.Field>
          { (cLocation == "In Person") &&
            <Form.Field required>
              <label>Table Number</label>
              <Select
                value={cTicketLocation}
                options={locationOptions}
                onChange={(_e, data) => setCTicketLocation("" + data.value || "")}
              />
            </Form.Field>
          } */}
          {/* <Form.Field required>
            <label>Table Number</label>
            <Select
              value={cTicketLocation}
              options={locationOptions}
              onChange={(_e, data) => setCTicketLocation("" + data.value || "")}
            />
          </Form.Field> */}
          <Form.Field>
            <label>Contact Info:</label>
            <Input
              placeholder="i.e. phone number / email etc. in case mentors can't find you"
              value={cTicketContact}
              onChange={(e) => setCTicketContact(e.target.value)}
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
                location: cLocation == "Virtual" ? "Virtual" : cTicketLocation,
                contact: cTicketContact.length === 0 ? "N/A" : cTicketContact,
              }),
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
          {/* <b>Location:</b> {ticket.data.location}
          <br /> */}
          <b>Contact:</b> {ticket.data.contact}
        </p>
        <p>
          {settings &&
          settings.jitsi_link &&
          settings.jitsi_link.includes("://") ? (
            <a href={settings.jitsi_link + "/" + ticket.uid} target="_blank">
              {settings.jitsi_link + "/" + ticket.uid}
            </a>
          ) : null}
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
          <b>Claimed by:</b> {ticket.claimed_by}
        </p>
        <p>
          Please join your mentor at the provided jitsi video link.
        </p>
        <p>
          {settings &&
          settings.jitsi_link &&
          settings.jitsi_link.includes("://") ? (
            <a href={settings.jitsi_link + "/" + ticket.uid} target="_blank">
              {settings.jitsi_link + "/" + ticket.uid}
            </a>
          ) : null}
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
