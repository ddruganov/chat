type RequestParams = {
  method: string;
  headers: HeadersInit;
  credentials: RequestCredentials;
  body?: string;
};
export default RequestParams;
