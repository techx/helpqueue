// @ts-ignore
import { JsonEditor as Editor } from "jsoneditor-react";
// TODO(kevinfang): Upgrade to react-table v7
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import "jsoneditor-react/es/editor.min.css";
import React, { useState, useEffect } from "react";
import useLogin from "../hooks/useLogin";
import {
  Button,
  CardBody,
  Card,
  CardTitle,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import ServerHelper, { ServerURL } from "./ServerHelper";
import createAlert, { AlertType } from "./Alert";
import { User, ClientSettings } from "./Types";

const AdminPage = () => {
  document.body.classList.add("white");
  const { getCredentials, logout } = useLogin();
  const [settingsJSON, setSettingsJSON] = useState<ClientSettings | null>(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const promote = async (userID: string, type: string, value: boolean) => {
    const res = await ServerHelper.post(ServerURL.promoteUser, {
      ...getCredentials(),
      user_id: userID,
      type: type,
      value: value ? 1 : 0
    });
    if (res.success) {
      setSettingsJSON(res.settings);
      setData(res.users);
      createAlert(AlertType.Success, "Updated User");
    } else {
      createAlert(AlertType.Error, "Failed to update User");
    }
  };
  const columns = [
    {
      Header: "Name",
      accessor: "name"
    },
    {
      Header: "Email",
      accessor: "email"
    },
    {
      Header: "Admin",
      accessor: "admin_is",
      Cell: (row: { original: { id: string }; value: string }) => (
        <Button
          onClick={() => promote(row.original.id, "admin", !row.value)}
          color={row.value ? "primary" : "secondary"}
        >
          {row.value ? "IS admin" : "NOT admin"}
        </Button>
      )
    },
    {
      Header: "Mentor",
      accessor: "mentor_is",
      Cell: (row: { original: { id: string }; value: string }) => (
        <Button
          onClick={() => promote(row.original.id, "mentor", !row.value)}
          color={row.value ? "primary" : "secondary"}
        >
          {row.value ? "IS mentor" : "NOT mentor"}
        </Button>
      )
    }
  ];

  const getData = async () => {
    const res = await ServerHelper.post(ServerURL.admin, getCredentials());
    if (res.success) {
      setSettingsJSON(res.settings);
      setData(res.users);
    } else {
      createAlert(
        AlertType.Error,
        "Failed to get admin data, are you logged in?"
      );
    }
  };

  const updateData = async () => {
    const res = await ServerHelper.post(ServerURL.updateAdmin, {
      ...getCredentials(),
      data: JSON.stringify(settingsJSON)
    });
    if (res.success) {
      setSettingsJSON(res.settings);
      setData(res.users);
      createAlert(AlertType.Success, "Updated JSON");
    } else {
      createAlert(AlertType.Error, "Failed to update JSON");
    }
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (searchValue.length === 0) {
      setFilteredData(data);
    } else {
      const value = searchValue.toLowerCase();
      // Searchable content
      setFilteredData(
        data.filter(
          (obj: User) =>
            (obj.name && obj.name.toLowerCase().includes(value)) ||
            (obj.email && obj.email.toLowerCase().includes(value)) ||
            (obj.skills && obj.skills.toLowerCase().includes(value))
        )
      );
    }
  }, [searchValue, data]);
  return (
    <div className="p-2">
      <h1>Admin Settings Page</h1>
      <br />
      <Row>
        <Col lg="12" xl="6">
          <Card>
            <CardBody>
              <CardTitle>
                <h2>Main Settings</h2>
              </CardTitle>
              <p>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Mentor Login Link:</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={
                      ((settingsJSON && settingsJSON.readonly_master_url) ||
                        "") +
                      "/login?key=" +
                      ((settingsJSON && settingsJSON.mentor_password_key) || "")
                    }
                    onFocus={e => e.target.select()}
                    readOnly
                  />
                </InputGroup>
              </p>
              <Button
                onClick={updateData}
                className="col-12 my-2"
                inverse
                style={{ backgroundColor: "#3883fa", borderColor: "#3883fa" }}
              >
                Save JSON Settings
              </Button>
              {settingsJSON ? (
                <Editor value={settingsJSON} onChange={setSettingsJSON} />
              ) : null}
              <ul className="justify-content-left text-left">
                <li>
                  queue_status (whether the queue is on or off): <b>true</b> or{" "}
                  <b>false</b>
                </li>
                <li>
                  queue_message (if you want to send a message to everyone):
                  empty or any string
                </li>
                <li>mentor_password_key (password mentors use to sign in!)</li>
                <li>app_creator (org running the program)</li>
                <li>app_name (name of event)</li>
                <li>app_contact_email (contact email for question)</li>
                <li>github_client_id (client id for github)</li>
                <li>github_client_secret (client secret for github)</li>
              </ul>

              <Button
                onClick={async () => {
                  if (
                    window.confirm(
                      "Are you sure you want to remove all ticket and non-admins?"
                    )
                  ) {
                    const res = await ServerHelper.post(ServerURL.resetEverything, {
                      ...getCredentials()
                    });
                    if (res.success) {
                      createAlert(AlertType.Success, "Deleted all tickets");
                      getData();
                    } else {
                      createAlert(AlertType.Error, "Something went wrong");
                    }
                  }
                }}
                className="col-12 my-2"
                inverse
                color="danger"
              >
                Reset all non-admin users and tickets
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col lg="12" xl="6">
          <Card>
            <CardBody>
              <CardTitle>
                <h2>Users</h2>
              </CardTitle>
              <Input
                placeholder="search"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
              <ReactTable data={filteredData} columns={columns} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminPage;
