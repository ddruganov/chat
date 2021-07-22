import Requestor from "@/common/service/requestor";

export default class AuthApi {
  getVkLoginLink = () => Requestor.post("/auth/getVkLoginLink");
  logout = () => Requestor.post("/auth/logout");

  getCurrentUser = () => Requestor.post("/auth/getCurrentUser");
}
