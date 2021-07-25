import StringHelper from "../../helpers/StringHelper";
import Join from "../clauses/Join";
import ClauseParser from "./ClauseParser";
import WhereClauseParser from "./WhereClauseParser";

export default class JoinClauseParser extends ClauseParser {
    private join: Join;

    constructor(join: Join) {
        super();

        this.join = join;
    }

    public parse(): string {
        let text = '';
        text += [
            this.join.type,
            'join',
            StringHelper.escape(this.join.from.tableName),
            'as',
            StringHelper.escape(this.join.from.alias),
            'on',
            new WhereClauseParser(this.join.on).parse(),
            ''
        ].join(' ');

        return text.trim();
    }
}