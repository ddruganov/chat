import { CancellationToken } from "typescript";

type Request = {
  id: string;
  cancelToken?: CancellationToken;
};
export default Request;
