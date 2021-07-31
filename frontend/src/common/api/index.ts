import AuthApi from "@/common/api/modules/auth";
import MessageApi from "@/common/api/modules/message";
import SettingsApi from "./modules/settings";

export default class Api {
  public static auth = new AuthApi();
  public static message = new MessageApi();
  public static settings = new SettingsApi();
}
