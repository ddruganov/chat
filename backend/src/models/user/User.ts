import Command from "../../components/db/Command";
import Query from "../../components/db/Query";

type UserData = {
    id: number;
    email: string;
    password: string;
    name: string;
    signupDate: string;
};

export default class User {

    private _id: number;
    private _email: string;
    private _password: string;
    private _name: string;
    private _signup_date: string;

    public static tableName() {
        return 'user.user';
    }

    public static get columns() {
        return ['id', 'email', 'password', 'name', 'signup_date'];
    }

    public static async findOne(condition: any): Promise<User | undefined> {
        let select = {} as { [key: string]: string };
        this.columns.forEach(column => {
            select[column] = '_' + column;
        });
        const sql = new Query()
            .addSelect(select)
            .setFrom({ alias: 'u', tableName: User.tableName() })
            .addJoin({ type: 'inner', from: { alias: 'wow', tableName: 'rand.table' }, on: {} })
            .addWhere(condition)
            .build();
        return undefined;

        switch (typeof condition) {
            case typeof 0: {
                return User.findOne({ id: condition });
            }
            case typeof {}: {
                let sql = 'select * from "user".user where ';
                for (const key in condition) {
                    sql += key + ' = ' + this.escape(condition[key]);
                }
                const data = await new Command(sql).execute();
                if (!data.rowCount) {
                    return undefined;
                }

                const userData = data.rows[0];
                for (const key in userData) {
                    userData['_' + key] = userData[key];
                    delete userData[key];
                }
                const model = Object.assign(new User(), userData);
                return model;
            }
        }

        return undefined;
    }

    private static escape(data: any) {
        switch (typeof data) {
            case typeof 0:
                return data;
            case typeof '':
                return "'" + data + "'";
        }

        return data;
    }

    public get signupDate() {
        return this._signup_date;
    }
}