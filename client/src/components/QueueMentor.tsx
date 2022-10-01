import React, { useState, useEffect } from "react";
import { Container, Button, Card, Select, Header, Divider } from "semantic-ui-react";
import useLogin from "../hooks/useLogin";
import ServerHelper, { ServerURL } from "./ServerHelper";
import { Ticket } from "./Types";
import createAlert, { AlertType } from "./Alert";
import { Row, Col, Badge } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import useViewer from "../hooks/useViewer";
import "./QueueMentor.css";
import TagsInput from "react-tagsinput";

const QueueMentor = () => {
  const { getCredentials } = useLogin();
  const { settings } = useViewer();
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [rankings, setRankings] = useState([]);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [queueLength, setQueueLength] = useState(0);
  const locationOptions = [
    { key: "", value: "no location", text: "No filter" },
  ].concat([{ key: "Virtual", value: "Virtual", text: "Virtual" }]).concat(
    ((settings && settings.locations) || "no location")
      .split(",")
      .map((l) => ({ key: l, value: l, text: l }))
  );
  const [filterTags, setFilterTags] = useState<string[]>([]);
  

  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchValue, setSearchValue] = useState<string>("no location");
  
  const getTickets = async () => {
    const res = await ServerHelper.post(
      ServerURL.userTickets,
      getCredentials()
    );
    document.title =
      `(${res.tickets && res.tickets.length}) ` +
      (settings ? settings.app_name : "") +
      " Help Queue";
    if (res.success) {
      setTickets(res.tickets);
      setRankings(res.rankings);
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
    if (!tickets) return;
    if (searchValue === "no location") {
      setFilteredTickets(tickets.filter((ticket) => filterTags.every(tag => ticket.data.tags.includes(tag))));
      return;
    }
    setFilteredTickets(
      tickets.filter((ticket) => ticket.data.location.includes(searchValue) && filterTags.every(tag => ticket.data.tags.includes(tag)))
    );
  }, [searchValue, tickets, filterTags]);

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
      queueCard = filteredTickets.map((ticket) => {
        return (
          <Card key={ticket.id} className="my-2" >
            <Header as='h3' style={{marginBottom: 0}}>
              {ticket.requested_by} <b>asked</b> {ticket.minutes}{" "}
              <b>mins ago</b>:
            </Header>
            <Divider/>

            <h3 style={{marginTop: '1rem', marginBottom: '2.5rem'}}>
              Question: {ticket.data.question}  
            </h3>
            {ticket.data.location !== "no location" &&
            ticket.data.location !== "default" ? (
              <h5>
                Location: &nbsp; 
              <Badge color="primary">
                {ticket.data.location}
              </Badge>
              </h5>
            ) : null}
            {ticket.data.tags.length == 0 ? (<> </>) : (
              <h5>
                Tags: &nbsp;
                {ticket.data.tags.map((tag) => (<Badge style={{marginRight: '0.4rem'}} color="primary">{tag}</Badge>))}
              </h5>
            )}
            {(ticket.data.location == "Virtual") ?
              <Button
                onClick={async () => {
                  const res = await ServerHelper.post(ServerURL.claimTicket, {
                    ...getCredentials(),
                    ticket_id: ticket.id,
                    claim_location: "virtual",
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
                Claim Virtual
              </Button>
              :
              <div id="claim-buttons">
                <Button.Group fluid>
                  <Button
                    onClick={async () => {
                      const res = await ServerHelper.post(ServerURL.claimTicket, {
                        ...getCredentials(),
                        ticket_id: ticket.id,
                        claim_location: "virtual",
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
                    Claim Virtual
                  </Button>
                  <Button
                    onClick={async () => {
                      const res = await ServerHelper.post(ServerURL.claimTicket, {
                        ...getCredentials(),
                        ticket_id: ticket.id,
                        claim_location: "in person",
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
                    Claim In Person
                  </Button>
                </Button.Group>
              </div>
            }
          </Card>
        );
      });
    }
  } else if (ticket != null) {
    // Ticket has been claimed
    queueCard = (
      <>
      <Card key={ticket.id} className="my-2">
      <Header as='h3' style={{marginBottom: 0}}>
        <b>You have claimed:</b> {ticket.requested_by}{" "}
      </Header>
      <Divider />
        <h3>
          <Badge>
           {ticket.data.question}
          </Badge>
        </h3>

        {ticket.data.location !== "no location" &&
            ticket.data.location !== "default" ? (
              <h5>
                Location: &nbsp; 
              <Badge color="primary">
                {ticket.data.location}
              </Badge>
              </h5>
            ) : null}

          {ticket.data.tags.length == 0 ? (<> </>) : (
              <h5>
                Tags: &nbsp;
                {ticket.data.tags.map((tag) => (<Badge style={{marginRight: '0.4rem'}} color="primary">{tag}</Badge>))}
              </h5>
            )}
      </Card>
       
        <p>
          {settings &&
            settings.jitsi_link &&
            settings.jitsi_link.includes("://") ? (
            <a href={settings.jitsi_link + "/" + ticket.uid} target="_blank">
              {settings.jitsi_link + "/" + ticket.uid}
            </a>
          ) : null}
        </p>
        <div>
          <Button
            onClick={async () => {
              const res = await ServerHelper.post(ServerURL.closeTicket, {
                ...getCredentials(),
                ticket_id: ticket.id,
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
            color="red"
            onClick={async () => {
              const res = await ServerHelper.post(ServerURL.unclaimTicket, {
                ...getCredentials(),
                ticket_id: ticket.id,
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
      <Row>
        <Col lg={rankings.length > 0 ? "8" : "12"}>
          <Card>
            <h2>Mentor Queue</h2>
            <p>Queue length: {queueLength}</p>
            <Select
              options={locationOptions}
              value={searchValue}
              onChange={(_e, data) => setSearchValue("" + data.value || "")}
            />
            <TagsInput tagProps={{className: 'react-tagsinput-tag colorthing'}} inputProps={{placeholder: "Filter by Tags"}} value={filterTags}  onChange={(e) => setFilterTags(e)}/>
            {queueCard}
          </Card>
        </Col>
        {rankings.length > 0 ? (
          <Col lg="4">
            <Card>
              <h2>Mentor Leaderboard</h2>
              <ol>
                {rankings.map(
                  (
                    r: { name: string; rating: string; tickets: string },
                    ind
                  ) => {
                    return (
                      <li key={r.name}>
                        {r.name} - {r.rating}{" "}
                        <FontAwesomeIcon icon={faStar} color="gold" /> (
                        {r.tickets} {r.tickets == "1" ? "ticket" : "tickets"})
                      </li>
                    );
                  }
                )}
              </ol>
            </Card>
          </Col>
        ) : null}
      </Row>
    </Container>
  );
};

export default QueueMentor;
