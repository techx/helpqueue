import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Input,
  Card,
  CardBody,
  CardTitle
} from "reactstrap";
import useLogin from "../hooks/useLogin";
import ServerHelper, { ServerURL } from "./ServerHelper";
import { Ticket } from "./Types";

const QueueMentor = () => {
  const { redirectToDopeAuth, getCredentials } = useLogin();
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [queueLength, setQueueLength] = useState(0);

  const getTickets = async () => {
    const res = await ServerHelper.post(
      ServerURL.userTickets,
      getCredentials()
    );
    if (res.success) {
      setTickets(res.tickets);
      setTicket(res.ticket);
      setQueueLength(res.queue_length);
    } else {
      setTickets(null);
    }
  };
  useEffect(() => {
    // On load check to see what the status is of the ticket
    getTickets();

    const interval = setInterval(getTickets, 3000);
    return () => clearInterval(interval);
  }, []);

  let queueCard = null;
  if (ticket == null || ticket.status != 1) {
    // If the mentor version hasn't claimed the ticket
    if (tickets == null || queueLength == 0) {
      queueCard = <p>There are no tickets :(</p>;
    } else {
    queueCard = tickets.map(ticket => {
      return (
        <p key={ticket.id}>
          {ticket.requested_by} ({ticket.data.location}) asks:{" "}
          {ticket.data.question}
          <Button
            onClick={async () => {
              const res = await ServerHelper.post(ServerURL.claimTicket, {
                ...getCredentials(),
                ticket_id: ticket.id
              });
              if (res.success) {
                setTicket(res.ticket);
              }
            }}
          >
            Claim
          </Button>
        </p>
      );
    });
  }
  } else if (ticket != null) {
    // Ticket has been claimed
    queueCard = (
      <>
        <p>You have claimed: {ticket.requested_by} </p>
        <p>
          Question: {ticket.data.question}
          <br />
          Location: {ticket.data.location}
          <br />
          Contact: {ticket.data.contact}
        </p>
          <Button
            onClick={async () => {
              const res = await ServerHelper.post(ServerURL.closeTicket, {
                ...getCredentials(),
                ticket_id: ticket.id
              });
              if (res.success) {
                setTicket(null);
                getTickets();
              }
            }}
          >
            Close Ticket
          </Button>
          <Button
            onClick={async () => {
              const res = await ServerHelper.post(ServerURL.unclaimTicket, {
                ...getCredentials(),
                ticket_id: ticket.id
              });
              if (res.success) {
                getTickets();
              }
            }}
          >
            Unclaim
          </Button>
      </>
    );
  }
  return (
    <Container>
      <Card>
        <CardBody>
          <CardTitle><h2>Mentor Queue</h2></CardTitle>
          Queue length: {queueLength}
          {queueCard}
        </CardBody>
      </Card>
    </Container>
  );
};

export default QueueMentor;
