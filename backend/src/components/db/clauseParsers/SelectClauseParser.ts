import StringHelper from "../../helpers/StringHelper";
import Select from "../clauses/Select";
import ClauseParser from "./ClauseParser";

export default class SelectClauseParser extends ClauseParser {
    private select: Select;

    constructor(select: Select) {
        super();

        this.select = select;
    }

    public parse(): string {
        return Object.keys(this.select)
            .map(key => [StringHelper.escape(key), 'as', StringHelper.escape(this.select[key])].join(' '))
            .join(', ')
            .trim(); // remove the trailing comma
    }
}