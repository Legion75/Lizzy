import jwt from "jsonwebtoken";
import config from "config";
const fs = require("fs");
const path = require('path');


export function signJwt(
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions | undefined
) {
  /*const signingKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");*/
  const privateKeyPath = path.join(__dirname, '..', '..', 'config', config.get<string>(keyName));
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt<T>(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null {
  const privateKeyPath = path.join(__dirname, '..', '..', 'config', config.get<string>(keyName));
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  /*const publicKey = Buffer.from(privateKey, "base64").toString(
    "ascii"
  );*/

  try {
    const decoded = jwt.verify(token, privateKey) as T;
    return decoded;
  } catch (e) {
    return null;
  }
}