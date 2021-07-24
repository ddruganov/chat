import Requestor from "@/common/service/requestor";

export default class AuthApi {

  login = (email: string, password: string) => Requestor.post('/auth/login', { email: email, password: password });
  logout = () => Requestor.post("/auth/logout");

  getCurrentUser = () => Requestor.post("/auth/getCurrentUser");
}
