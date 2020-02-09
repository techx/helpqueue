import React from "react";
import { RouteComponentProps } from "react-router";
import useLogin from "../hooks/useLogin";
import useViewer from "../hooks/useViewer";

enum Status {
  start,
  loading,
  failed,
  succeed
}

const LoginGithub = (props: RouteComponentProps) => {
  const { isLoggedIn } = useViewer();
  const [loginStatus, setLoginStatus] = React.useState<Status>(
    isLoggedIn ? Status.succeed : Status.start
  );
  const search = new URLSearchParams(props.location.search);
  const { login } = useLogin();
  React.useEffect(() => {
    const code = search.get("code");
    const mentor_key = search.get("mentor_key");

    if (isLoggedIn) {
      window.location.replace("/profile");
    }
    if (
      code != null &&
      loginStatus === Status.start
    ) {
      setLoginStatus(0);
      login("GITHUB", "GITHUB", code, {"mentor_key": mentor_key, }).then((success: Boolean) => {
        setLoginStatus(success ? Status.succeed : Status.failed);
      });
    } else if (loginStatus === Status.start) {
      setLoginStatus(Status.failed);
    }
    // eslint-disable-next-line
  }, [isLoggedIn, loginStatus]);

  if (loginStatus === Status.start || loginStatus === Status.loading) {
    return <div><p style={{color: "white"}}>Attempting to login</p></div>;
  } else if (loginStatus === Status.succeed) {
    return <div><p style={{color: "white"}}>Successful Login</p></div>;
  } else {
    return <div><p style={{color: "white"}}>Login Failed</p></div>;
  }
};

export default LoginGithub;
