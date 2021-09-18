import { settings as cluster_settings } from "cluster";
import React, { useState, useEffect } from "react";
import { Container, Button, Input, Label, Card, Form, Accordion } from "semantic-ui-react";
import useViewer from "../hooks/useViewer";

const FAQPage = () => {
  const { settings } = useViewer();
  const panels = [
    {
      key: 'q1',
      title: {
        content: 'How do I sign up as a hacker?',
        icon: 'star',
      },
      content: [
        'Hackers can sign up with email.',
      ].join(' '),
    },
    {
      key: 'q2',
      title: {
        content: 'How do I sign up as a mentor?',
        icon: 'star',
      },
      content: [
        'Mentors sign up using a mentor key that is shared prior to the event by an admin user of HelpQ.',
      ].join(' '),
    },
    {
      key: 'q3',
      title: {
        content: 'What constitutes a good description of an issue?',
        icon: 'star',
      },
      content: [
        'The more specific you are with describing your issue, the more prepared mentors will be in guiding you. A good description explains what technologies, tools, or frameworks you\'re using, includes relevant context of the project, and summarizes the fixes that your team has tried to work around the bug.'
      ]
    }, {
      key: 'q4',
      title: {
        content: 'What to put as the event in the ticket? ',
        icon: 'star',
      },
      content: [
        'Select the track that you plan to submit to.'
      ]
    }, {
      key: 'q5',
      title: {
        content: 'I have trouble finding my mentor / hacker, where should I go? ',
        icon: 'star',
      },
      content: [
        'Please reach out in the slack to hackers or mentors. If you are still having difficulties please reach out to a team member at help@hackmit.org.'
      ]
    }, {
      key: 'q6',
      title: {
        content: 'What if I have more questions or need help using helpq? ',
        icon: 'star',
      },
      content: [
        'Reach out to us in the slack or send us an email' + 
          ((settings == null) ? '!' : ' at ' + settings.app_contact_email + '!')
      ]
    },
  ]
  return (
    <Container>
      <Card>
        <h2>Frequently Asked Questions</h2>
        <Accordion
          panels={panels}
          exclusive={false}
          fluid
        />
      </Card>
    </Container>
  );
};

export default FAQPage;