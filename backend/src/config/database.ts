import { Client, QueryResult } from "pg";

export default class Database {
  private _db: Client;

  constructor() {
    this._db = new Client({
      host: 'localhost',
      port: 5432,
      database: 'chat',
      user: 'ddruganov',
      password: 'admin'
    });
    this._db.connect((err) => {
      err && console.log('pg connection error:', err.message, err.stack);
    })
  }

  async addUser(data: any) {
    return new Promise(async (resolve, reject) => {
      const exists = await this.isUserExist(data);
      if (exists) {
        return resolve(true);
      }

      this._db.query(
        "INSERT INTO users (name, user_id) VALUES ($1, $2)",
        [data.name, data.user_id],
        function (err, res) {
          err ? reject(new Error(err.message)) : resolve(res);
        }
      );

    });
  }

  isUserExist(data: any) {
    return new Promise((resolve, reject) => {
      this._db.query(
        "select * from users where name = $1",
        [data.name],
        function (err, res: QueryResult<any>) {
          err ? reject(new Error(err.message)) : resolve(res.rows[0]);
        }
      );
    });
  }

  fetchUserMessages(data: any) {
    const messages = [];
    return new Promise((resolve, reject) => {
      this._db.query(
        "SELECT * from messages where name = $1",
        [data.name],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows);
        }
      );

    });
  }

  storeUserMessage(data: any) {
    return new Promise((resolve, reject) => {
      this._db.query(
        "INSERT INTO messages (message, user_id, name) VALUES ($1, $2, $3)",
        [data.message, data.user_id, data.name],
        function (err, rows) {
          if (err) reject(new Error(err.message));
          else resolve(rows);
        }
      );
    });
  }
}