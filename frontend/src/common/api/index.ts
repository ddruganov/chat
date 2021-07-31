import AuthApi from "@/common/api/modules/auth";
import MessageApi from "@/common/api/modules/message";

export default class Api {
  public static auth = new AuthApi();
  public static message = new MessageApi();
}
