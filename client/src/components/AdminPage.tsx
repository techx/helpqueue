// @ts-ignore
import { JsonEditor as Editor } from "jsoneditor-react";
// TODO(kevinfang): Upgrade to react-table v7
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import "jsoneditor-react/es/editor.min.css";
import React, { useState, useEffect, Fragment } from "react";
import useLogin from "../hooks/useLogin";
import {
  Button,
  Container,
  Alert,
  CardBody,
  Card,
  CardTitle,
  Row,
  Col,
  Input
} from "reactstrap";
import ServerHelper, { ServerURL } from "./ServerHelper";
import createAlert, { AlertType } from "./Alert";
import { User } from "./Types";

const AdminPage = () => {
  document.body.classList.add("white");
  const { getCredentials } = useLogin();
  const [settingsJSON, setSettingsJSON] = useState(null);
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
      accessor: "name" // String-based value accessors!
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
            obj.name.toLowerCase().includes(value) ||
            obj.email.toLowerCase().includes(value) ||
            obj.skills.toLowerCase().includes(value)
        )
      );
    }
  }, [searchValue, data]);
  return (
    <div className="p-5">
      <h1>Admin Settings Page</h1>
      <br />
      <Row>
        <Col lg="12" xl="6">
          <Card>
            <CardBody>
              <CardTitle>
                <h2>JSON Settings</h2>
              </CardTitle>
              <p>
                <Button onClick={updateData}> Save JSON Settings </Button>
              </p>
              {settingsJSON ? (
                <Editor value={settingsJSON} onChange={setSettingsJSON} />
              ) : null}
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
                onChange={e=>setSearchValue(e.target.value)}
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
