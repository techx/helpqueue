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

const LoginCallback = (props: RouteComponentProps) => {
  const { isLoggedIn } = useViewer();
  const [loginStatus, setLoginStatus] = React.useState<Status>(
    isLoggedIn ? Status.succeed : Status.start
  );
  const search = new URLSearchParams(props.location.search);
  const { login } = useLogin();
  React.useEffect(() => {
    const id = search.get("id");
    const token = search.get("token");
    const email = search.get("email");
    if (isLoggedIn) {
      window.location.replace("/");
    }
    if (
      id != null &&
      token != null &&
      email != null &&
      loginStatus === Status.start
    ) {
      setLoginStatus(0);
      login(id, email, token).then((success: Boolean) => {
        setLoginStatus(success ? Status.succeed : Status.failed);
      });
    } else if (loginStatus === Status.start) {
      setLoginStatus(Status.failed);
    }
    // eslint-disable-next-line
  }, [isLoggedIn, loginStatus]);

  if (loginStatus === Status.start || loginStatus === Status.loading) {
    return <div>Attempting to login</div>;
  } else if (loginStatus === Status.succeed) {
    return <div>Successful Login</div>;
  } else {
    return <div>Login Failed</div>;
  }
};

export default LoginCallback;
