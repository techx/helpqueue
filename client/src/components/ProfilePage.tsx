import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Input,
  Label,
  CardBody,
  CardTitle,
  Card
} from "reactstrap";
import useLogin from "../hooks/useLogin";
import { User } from "./Types";
import ServerHelper, { ServerURL } from "./ServerHelper";
import useViewer from "../hooks/useViewer";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.
import { useCookies } from "react-cookie";
import createAlert, { AlertType } from "./Alert";

const ProfilePage = () => {
  const { getCredentials } = useLogin();
  const [_cookies, setCookie] = useCookies();
  const { isLoggedIn } = useViewer();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const getUser = async () => {
    const res = await ServerHelper.post(ServerURL.userTicket, getCredentials());
    if (res.success) {
      setUser(res.user);
      setName(res.user.name);
    } else {
      setUser(null);
      createAlert(AlertType.Error, "Failed to get user, are you logged in?");
    }
  };
  const saveProfile = async (shouldRedirect:boolean) => {
    if (name.length === 0) {
      createAlert(AlertType.Error, "Name must be nonempty");
      return;
    }
    const res = await ServerHelper.post(ServerURL.userUpdate, {
      ...getCredentials(),
      name: name,
      affiliation: "", // TODO(kevinfang): add company affiliation
      skills: skills.join(";")
    });
    if (res.success) {
      setUser(res.user);
      createAlert(AlertType.Success, "Updated profile");
    } else {
      setUser(null);
      createAlert(AlertType.Error, "Failed to update profile");
    }
    if (shouldRedirect) {
      window.location.href="/";
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const tempName = user ? user.name : null;
  const tempSkills = user ? user.skills : null;
  useEffect(() => {
    if (tempName) {
      setName(tempName);
      setCookie("name", tempName);
    }
    if (tempSkills) {
      setSkills(tempSkills.split(";").filter(e => e.length > 0));
    }
  }, [tempName, tempSkills]);

  if (!isLoggedIn) {
    window.location.href = "/login";
  }

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <Container>
      <Card>
        <CardBody>
          <CardTitle>
            <h2> Profile </h2>
          </CardTitle>
          <Input value={user.email} readOnly />
          <Label>
            Name:
            <Input value={name} onChange={e => setName(e.target.value)} />
          </Label>
          <br />
          {user.mentor_is ? (
            <>
              <Label>
                Technical skills (i.e. javascript, java...):
                <TagsInput value={skills} onChange={e => setSkills(e)} />
              </Label>
              <p>
                You are an mentor! <a href="/m">Go to mentor queue!</a>
              </p>
            </>
          ) : null}
          <Button onClick={() => saveProfile(false)}>Save Profile</Button>
          <Button color="primary" onClick={()=>{
            saveProfile(true);
          }}>
            Go to Queue!
          </Button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ProfilePage;
