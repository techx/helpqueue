// @ts-ignore
import { JsonEditor as Editor } from "jsoneditor-react";
// TODO(kevinfang): Upgrade to react-table v7
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import "jsoneditor-react/es/editor.min.css";
import React, { useState, useEffect } from "react";
import useLogin from "../hooks/useLogin";
import { Button, Container } from "reactstrap";
import ServerHelper, { ServerURL } from "./ServerHelper";

const AdminPage = () => {
  const { getCredentials } = useLogin();
  const [settingsJSON, setSettingsJSON] = useState(null);
  const [data, setData] = useState([]);
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
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <Container>
      <h1>Admin Settings Page</h1>
      {settingsJSON ? (
        <Editor value={settingsJSON} onChange={setSettingsJSON} />
      ) : null}
      <Button onClick={updateData}> Save Settings </Button>
      <ReactTable data={data} columns={columns} />
    </Container>
  );
};

export default AdminPage;
