import WhereClauseParser from "./clauseParsers/WhereClauseParser";
import FromClauseParser from "./clauseParsers/FromClauseParser";
import From from "./clauses/From";
import Where from "./clauses/where/Where";
import DatabaseAccessor from "./DatabaseAccessor";

export default class DeleteCommand extends DatabaseAccessor {
    private sql = '';

    private _from: From;
    private _where?: Where;

    public from(from: From) {
        this._from = from;
        return this;
    }

    public where(condition: Where) {
        this._where = condition;
        return this;
    }

    public build() {
        let pieces = ['delete', 'from', new FromClauseParser(this._from).parse()];
        if (this._where) {
            pieces.push('where');
            pieces.push(new WhereClauseParser(this._where).parse());
        }

        this.sql = pieces.join(' ');
    }

    public async execute() {
        this.build();

        try {
            await this._db.query(this.sql);
        }
        catch (e) {
            return false;
        }

        return true;
    }
}