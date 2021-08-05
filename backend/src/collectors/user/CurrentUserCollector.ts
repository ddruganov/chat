import User from "../../models/user/User";
import BaseCollector from "../base/BaseCollector";

export default class CurrentUserCollector extends BaseCollector {

    private user: User;

    constructor() {
        super();
    }

    public get() {
        return {
            id: this.user.id,
            name: this.user.name,
            nick: this.user.nick
        };
    }

    public setUser(user: User): CurrentUserCollector {
        this.user = user;
        return this;
    }
}