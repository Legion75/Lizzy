import { signJwt } from "../utils/jwt";
import { connection } from "../utils/connectToDB";
import argon2 from "argon2";
import log from "../utils/logger";

export async function createSession( userID: number ) {
    const conn = await connection;
    const [result]: any = await conn.query(
      'INSERT INTO session (userID) VALUES (?)',
      [userID]
    );

    const insertId = result.insertId;
    const [rows] = await conn.query(
      'SELECT * FROM session WHERE sessionID = ?',
      [insertId]
    );

    return rows;
}

export async function findSessionById(id: number) {
    const conn = await connection;
    const [result] = await conn.query(
        'SELECT * FROM session WHERE sessionID = ?',
        [id]
      );
    
    return result;
}

export async function signRefreshToken( userId: number) {
  const session: any = await createSession(userId);

  const refreshToken = signJwt(
    {
      session: session[0].sessionID,
    },
    "refreshTokenPrivateKey",
    {
      expiresIn: 31536000,
    }
  );

  return refreshToken;
}

export function signAccessToken(user: object) {
  //const payload = JSON.stringify(user);
  const payload = user;

  const accessToken = signJwt(payload, "accessTokenPrivateKey", {
    expiresIn: 31536000,
  });
  return accessToken;
}

export async function validatePassword(userID: number, password: string) {
    const conn = await connection;
    const [result]:any = await conn.query(
        'SELECT * FROM users WHERE userID = ?',
        [userID]);
        try {
            return await argon2.verify(result[0].password, password);
          } catch (e) {
            log.error(e, "Could not validate password");
            return false;
          }
}