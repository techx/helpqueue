import React, { useState, useEffect } from "react";
import { Container, Button, Card } from "semantic-ui-react";
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
      if (!res.user.mentor_is) {
        createAlert(
          AlertType.Error,
          "You are not registered as a mentor! Ask your admin to whitelist you"
        );
      }
    } else {
      setTickets(null);
    }
  };
  useEffect(() => {
    // On load check to see what the status is of the ticket
    getTickets();

    const interval = setInterval(getTickets, 5000);
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
            <p>
              {ticket.requested_by} <b>asked</b> {ticket.minutes}{" "}
              <b>mins ago</b>:
            </p>
            <p>{ticket.data.question}</p>
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
              basic
              color="green"
            >
              Claim <b>@ the location of</b> {ticket.data.location}
            </Button>
          </Card>
        );
      });
    }
  } else if (ticket != null) {
    // Ticket has been claimed
    queueCard = (
      <>
        <p>
          <b>You have claimed:</b> {ticket.requested_by}{" "}
        </p>
        <p>
          <b>Question:</b> {ticket.data.question}
          <br />
          <b>Location:</b> {ticket.data.location}
          <br />
          <b>Contact:</b> {ticket.data.contact}
        </p>
        <div>
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
            color="green"
          >
            Close Ticket
          </Button>
          <Button
            color='red'
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
            basic
          >
            Unclaim
          </Button>
        </div>
      </>
    );
  }
  return (
    <Container>
      <Card>
        <h2>Mentor Queue</h2>
        <p>Queue length: {queueLength}</p>
        {queueCard}
      </Card>
    </Container>
  );
};

export default QueueMentor;
