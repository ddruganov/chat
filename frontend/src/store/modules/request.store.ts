import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import Request from "@/types/request/Request";
import { CancellationToken } from "typescript";

// State
class RequestState {
  requests: Request[] = [];
}

// Getters
class RequestGetters extends Getters<RequestState> {
  get allRequests() {
    return this.state.requests;
  }
  get requestById() {
    return (id: string) => this.state.requests.find((r) => r.id === id);
  }
  get requestsPending() {
    return this.state.requests.length > 0;
  }
}

// Actions
export const BEGIN_HTTP_REQUEST = "beginHttpRequest";
export const END_HTTP_REQUEST = "endHttpRequest";
class RequestActions extends Actions<RequestState, RequestGetters, RequestMutations, RequestActions> {
  [BEGIN_HTTP_REQUEST](payload: { id: string; cancelToken?: CancellationToken }): void {
    this.commit(BEGIN_HTTP_REQUEST, payload);
  }
  [END_HTTP_REQUEST](payload: string) {
    this.commit(END_HTTP_REQUEST, payload);
  }
}

// Mutations
class RequestMutations extends Mutations<RequestState> {
  [BEGIN_HTTP_REQUEST](payload: { id: string; cancelToken?: CancellationToken }) {
    this.state.requests.push(payload);
  }
  [END_HTTP_REQUEST](payload: string) {
    this.state.requests = this.state.requests.filter((request) => request.id !== payload);
  }
}

// Create a module with module asset classes
export const requestStore = new Module({
  namespaced: true,
  state: RequestState,
  getters: RequestGetters,
  actions: RequestActions,
  mutations: RequestMutations,
});
