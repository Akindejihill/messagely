/** User class for message.ly */
const db = require("../db")
const ExpressError = require("../expressError");
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../config.js');

/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {
    const key = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    
    const result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING username, password, first_name, last_name, phone`,
      [username, key, first_name, last_name, phone]
    );

    return result.rows[0];
   }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT password FROM users WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];
    const verified = await bcrypt.compare(password, user.password);
    return verified;
   }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    db.query(
      `UPDATE users
      SET last_login_at = CURRENT_TIMESTAMP
      where username = $1`,
      [username]
    );
  }



  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */
  static async all() { 
    const result = await db.query(
      `SELECT username, first_name, last_name, phone
      FROM users`
    );

    return result.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone, join_at, last_login_at
      FROM users
      WHERE username = $1`,
      [username]
    );

    return result.rows[0];
   }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { 
    const result = await db.query(
      `SELECT id, to_username, body, sent_at, read_at, first_name, last_name, phone
      FROM messages
      JOIN users ON messages.to_username = users.username
      WHERE from_username = $1`,
      [username]
    );

    return result.rows.map(messages => {
      return {id : messages.id,
              to_user: {username : messages.to_username,
                        first_name: messages.first_name,
                        last_name: messages.last_name,
                        phone: messages.phone
                       },
              body : messages.body,
              sendt_at : messages.sent_at,
              read_at : messages.read_at
             }
    });
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { 
    const result = await db.query(
      `SELECT id, from_username, body, sent_at, read_at, first_name, last_name, phone
      FROM messages
      JOIN users ON messages.from_username = users.username
      WHERE to_username = $1`,
      [username]
    );

    return result.rows.map(messages => {
      return {id : messages.id,
              to_user: {username : messages.to_username,
                        first_name: messages.first_name,
                        last_name: messages.last_name,
                        phone: messages.phone
                       },
              body : messages.body,
              sendt_at : messages.sent_at,
              read_at : messages.read_at
             }
    });
  }
}


module.exports = User;