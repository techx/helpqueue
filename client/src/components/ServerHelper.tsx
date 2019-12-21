export enum ServerURL {
  createTicket = "/api/v1/ticket/create",
  claimTicket = "/api/v1/ticket/claim",
  unclaimTicket = "/api/v1/ticket/unclaim",
  closeTicket = "/api/v1/ticket/close",
  cancelTicket = "/api/v1/ticket/cancel",
  rateTicket = "/api/v1/ticket/rate",
  userTicket = "/api/v1/user/ticket",
  userTickets = "/api/v1/user/tickets",
  userUpdate = "/api/v1/user/update",
  login = "/api/v1/client/login",
  settings = "/api/v1/client",
  admin = "/api/v1/admin/settings",
  updateAdmin = "/api/v1/admin/update",
  promoteUser = "/api/v1/admin/promote",
  resetEverything = "/api/v1/admin/reset"
}

const ServerHelper = {
  post: async (
    url: ServerURL,
    data: any,
  ): Promise<{ success: boolean; [key: string]: any }> => {
    try {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      };
      const response = await fetch(url, config);
      if (response.ok) {
        const json = await response.json();
        return json;
      }
    } catch (error) {}
    return { success: false };
  }
};

export default ServerHelper;
