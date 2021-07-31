import Requestor from "@/common/service/requestor";
import User from "@/types/auth/User";

export default class SettingsApi {
  saveUser = (user: User) => Requestor.post('/settings/saveUser', { user: user });
}
