import React from "react";

import { useCookies } from "react-cookie";
import { ClientSettings } from "../components/Types";

export enum Query {
  name = "name",
  email = "email",
  uid = "uid",
  settings = "settings"
}

const useViewer = () => {
  const [cookies, setCookies] = useCookies([
    Query.name,
    Query.email,
    Query.uid,
    Query.settings
  ]);
  const viewer = (value: Query) => {
    return cookies[value];
  };
  const isLoggedIn = React.useMemo(() => cookies[Query.uid] != null, [cookies]);

  const settings: ClientSettings | null = React.useMemo(
    () => (cookies[Query.settings] ? cookies[Query.settings] : null),
    [cookies]
  );
  return { viewer, isLoggedIn, settings };
};

export default useViewer;
