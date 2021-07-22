import config from "@/config";

import router from "@/router/index";
import { store } from "@/store";
import { BEGIN_HTTP_REQUEST, END_HTTP_REQUEST, requestStore } from "@/store/modules/request.store";
import { authStore, SET_AUTHENTICATED } from "@/store/modules/auth.store";
import ApiResponse from "@/types/api/ApiResponse";
import RequestParams from "@/types/api/RequestParams";

export default class Requestor {
  static post(url: string, form?: any) {
    const params: RequestParams = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    };

    requestStore.context(store).dispatch(BEGIN_HTTP_REQUEST, { id: url, cancelToken: undefined });

    return fetch(config.host + url, params)
      .then((response) => response.json())
      .then((response: ApiResponse) => {
        if (Object.prototype.hasOwnProperty.call(response, "code")) {
          switch (response.code) {
            case 400:
              router.push({ path: "/404" });
              break;
            case 401:
              authStore.context(store).dispatch(SET_AUTHENTICATED, false);
              router.push({ path: "/auth/login" });
              break;
          }
        }

        return response;
      })
      .finally(() => {
        requestStore.context(store).dispatch(END_HTTP_REQUEST, url);
      });
  }
}
