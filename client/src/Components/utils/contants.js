export const BASE_URL = "http://localhost:5500";
// export const BASE_URL = "https://jambu-space-server.herokuapp.com";
export const API_URL = BASE_URL + "/api/client/";
export const ADMIN_API_URL = BASE_URL + "/api/admin/"
export const CUSTOMER_API_URL = BASE_URL + "/api/customers/"
export const SELLER_API_URL = BASE_URL + "/api/sellers/"


export const ADMIN_API_All_JOBS = BASE_URL + "/api/jobs/"

export const SOCKET_URL = "ws://jambu-space-socket-server.herokuapp.com";

export const STATUS = {
  PLACED: "PLACED",
  STARTED: "STARTED",
  PENDING: "PENDING",
  DELIVERED: "DELIVERED",
  CANCELED: "CANCELED",
  REVISIONS: "REVISIONS",
  COMPLETED: "COMPLETED",
  PAID: "PAID",
};
