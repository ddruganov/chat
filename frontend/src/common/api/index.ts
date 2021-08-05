import AuthApi from "@/common/api/modules/auth";
import ChatApi from "@/common/api/modules/chat";
import SettingsApi from "@/common/api/modules/settings";
import UserApi from "@/common/api/modules/user";

export default class Api {
  public static auth = new AuthApi();
  public static chat = new ChatApi();
  public static settings = new SettingsApi();
  public static user = new UserApi();
}
