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

  const redirectToDopeAuth = (data?: [string, string][]) => {
    let otherdata = "";
    if (data != null) {
      data.forEach(value => {
        otherdata += `${value[0]}=${value[1]}&`;
      });
    }
    if (otherdata.length > 0) {
      otherdata = `?${otherdata.substring(0, otherdata.length - 1)}`;
    }
    window.location.href =
      "https://dopeauth.com/login/" +
      encodeURIComponent(
        (settings ? settings.readonly_master_url : "") + "/login/auth"
      ) +
      otherdata;
  };

  const login = async (
    uid: string,
    email: string,
    token: string,
    data?: any,
  ): Promise<Boolean> => {
    if (data == null) {
      data = {};
    }
    try {
      // Server side check!
      const json = await ServerHelper.post(ServerURL.login, {
        email: email,
        token: token,
        uid: uid,
        name: cookies['name'],
        ...data
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
