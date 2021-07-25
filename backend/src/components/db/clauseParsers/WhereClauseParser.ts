import StringHelper from "../../helpers/StringHelper";
import Operand from "../clauses/where/Operand";
import Operator from "../clauses/where/Operator";
import Where from "../clauses/where/Where";
import ClauseParser from "./ClauseParser";

export default class WhereClauseParser extends ClauseParser {
    private where: Where;

    constructor(where: Where) {
        super();

        this.where = where;
    }

    public parse(): string {
        return this._parse(this.where).trim();
    }

    private _parse(where: Where) {
        const isOperator = (object: any): object is Operator => 'operands' in object;
        const isOperand = (object: any): object is Operand => 'value' in object;

        if (isOperator(where)) {
            let sql = '';
            where.operands.forEach((o, idx) => {
                const isLastOperand = idx === where.operands.length - 1;
                let parsed = [this._parse(o), (isOperand(o) && !isLastOperand) ? where.operator : '', ''].join(' ');
                if (isOperator(o)) {
                    parsed = ['(', parsed.trim(), ')'].join('');
                }
                sql += parsed;
            });
            return sql;
        }

        if (['like', 'ilike'].includes(where.value)) {
            where.right = ['%', where.right, '%'].join('');
        }

        let right;
        if (Array.isArray(where.right)) {
            where.right = ['(', where.right.join(','), ')'].join('');
        }
        right ||= where.right;

        return [StringHelper.escape(where.left), where.value, StringHelper.escape(where.right, StringHelper.isTableName(String(right)) ? '"' : "'")].join(' ').trim();
    }
}