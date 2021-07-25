import StringHelper from "../../helpers/StringHelper";
import From from "../clauses/From";
import ClauseParser from "./ClauseParser";

export default class FromClauseParser extends ClauseParser {
    private from: From;

    constructor(from: From) {
        super();

        this.from = from;
    }

    public parse(): string {
        return [StringHelper.escape(this.from.tableName), 'as', StringHelper.escape(this.from.alias)].join(' ').trim();
    }
}