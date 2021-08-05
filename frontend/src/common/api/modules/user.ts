import Requestor from "@/common/service/requestor";

export default class UserApi {
  search = (search: string) => Requestor.post('/user/search', { search: search });
}
