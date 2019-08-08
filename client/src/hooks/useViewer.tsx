import React from "react";

import { useCookies } from "react-cookie";

export enum Query {
  name = "name"
}

const useViewer = () => {
  const [cookies] = useCookies([Query.name]);
  const viewer = (value: Query) => {
    return cookies[value];
  };
  const isLoggedIn = React.useMemo(() => cookies[Query.name] != null, [
    cookies
  ]);
  return { viewer, isLoggedIn };
};

export default useViewer;
