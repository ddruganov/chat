import Api from "@/common/api";
import User from "@/types/auth/User";
import { Getters, Mutations, Actions, Module } from "vuex-smart-module";

// State
class AuthState {
  user?: User = undefined;
  isAuthenticated: boolean = false;
}

// Getters
class AuthGetters extends Getters<AuthState> {
  get isAuthenticated() {
    return this.state.isAuthenticated;
  }
  get authenticatedUser() {
    return this.state.user!;
  }
}

// Actions
export const GET_CURRENT_USER = "getCurrentUser";
export const SET_AUTHENTICATED = "setAuthenticated";
class AuthActions extends Actions<AuthState, AuthGetters, AuthMutations, AuthActions> {
  [GET_CURRENT_USER]() {
    return Api.auth
      .getCurrentUser()
      .then((response) => {
        this.commit(SET_USER, response.data.user);
        return response;
      })
      .catch((e) => e);
  }
  [SET_AUTHENTICATED](value: boolean) {
    return this.commit(SET_AUTHENTICATED, value);
  }
}

// Mutations
export const SET_USER = "setUser";
class AuthMutations extends Mutations<AuthState> {
  [SET_USER](payload: User) {
    this.state.user = payload;
  }
  [SET_AUTHENTICATED](payload: boolean) {
    this.state.isAuthenticated = payload;
  }
}

// Create a module with module asset classes
export const authStore = new Module({
  namespaced: true,
  state: AuthState,
  getters: AuthGetters,
  actions: AuthActions,
  mutations: AuthMutations,
});
