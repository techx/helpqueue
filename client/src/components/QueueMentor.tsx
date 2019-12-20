import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Input,
  Card,
  CardBody,
  CardTitle,
  CardFooter,
  CardText
} from "reactstrap";
import useLogin from "../hooks/useLogin";
import ServerHelper, { ServerURL } from "./ServerHelper";
import { Ticket } from "./Types";
import createAlert, { AlertType } from "./Alert";

const QueueMentor = () => {
  const { getCredentials } = useLogin();
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
          <Card key={ticket.id} className="my-2">
            <CardBody>
              <CardTitle>
                {ticket.requested_by} <b>asked</b> {ticket.minutes} <b>mins ago</b>:
              </CardTitle>
              <CardText>{ticket.data.question}</CardText>
                <Button
                  onClick={async () => {
                    const res = await ServerHelper.post(ServerURL.claimTicket, {
                      ...getCredentials(),
                      ticket_id: ticket.id
                    });
                    if (res.success) {
                      setTicket(res.ticket);
                      createAlert(AlertType.Success, "Claimed ticket");
                    }
                  }}
                  className="col-12"
                  outline
                  color="success"
                >
                  Claim <b>@ the location of</b> {ticket.data.location}
                </Button>
            </CardBody>
          </Card>
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
              createAlert(AlertType.Success, "Closed ticket");
            }
          }}
          className="col-6"
          color="success"
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
              createAlert(AlertType.Success, "Unclaimed ticket");
            }
          }}
          className="col-6"
          outline
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
          <CardTitle>
            <h2>Mentor Queue</h2>
          </CardTitle>
          Queue length: {queueLength}
          {queueCard}
        </CardBody>
      </Card>
    </Container>
  );
};

export default QueueMentor;
