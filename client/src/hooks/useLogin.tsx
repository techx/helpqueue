import { useCookies } from "react-cookie";
import ServerHelper, { ServerURL } from "../components/ServerHelper";
import useViewer from "./useViewer";

const useLogin = () => {
  // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "uid",
    "email",
    "name"
  ]);
  const {settings} = useViewer();

  const redirectToDopeAuth = () => {
    window.location.href =
        "https://dopeauth.com/login/" +
        encodeURIComponent((process.env.REACT_APP_SITEURL || "") + "/login/auth");
  };

  const login = async (
    uid: string,
    email: string,
    token: string
  ): Promise<Boolean> => {
    try {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          token: token,
          uid: uid
        })
      };
      // Server side check!
      const json = await ServerHelper.post(ServerURL.login, {
        email: email,
        token: token,
        uid: uid,
        name: cookies['name']
      });
      if (json["success"]) {
        setCookie("token", json["token"], { path: "/" });
        setCookie("uid", json["uid"], { path: "/" });
        setCookie("email", json["email"], { path: "/" });
        return true;
      }
    } catch (error) {}
    return false;
  };
  const getCredentials = () => {
    return {
      uid: cookies["uid"],
      token: cookies["token"]
    };
  };
  const logout = () => {
    removeCookie("name");
    removeCookie("token");
    removeCookie("uid");
    removeCookie("email");
  };
  return { redirectToDopeAuth, getCredentials, login, logout };
};

export default useLogin;
