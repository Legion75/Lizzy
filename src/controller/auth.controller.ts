import { Request, Response } from "express";
import { get } from "lodash";
import { CreateSessionInput } from "../schema/auth.schema";
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
  validatePassword,
} from "../service/auth.service";
import { finduserbyemail, findUserById } from "../service/user.service";
import { verifyJwt } from "../utils/jwt";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  const message = "Invalid email or password";
  const { email, password } = req.body;
  const user:any = await finduserbyemail(email);

  if (Array.isArray(user)) {
    if(user.length <= 0){
        return res.send(message);
    }
  } else {
    if( user.affectedRows <= 0){
        return res.send(message);
    }
  }


  if (user[0].verified == 0) {
    return res.send("Please verify your email");
  }

  const isValid = await validatePassword(user[0].userID, password);
  if (!isValid) {
    return res.send(message);
  }

  const tuser = {
    userID: user[0].userID,
    email: user[0].email,
    fname: user[0].fname,
    lname: user[0].lname,
  };
 
  const accessToken = signAccessToken(tuser);

  const refreshToken = await signRefreshToken(user[0].userID);


  return res.send({
    accessToken,
    refreshToken,
  });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  let refreshToken = get(req, "headers.x-refresh");
  if (refreshToken !== undefined) {
    if (Array.isArray(refreshToken)) {
        refreshToken = refreshToken.join("");
      }
  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    "refreshTokenPublicKey"
  );
    
  if (!decoded) {
    return res.status(401).send("Could not refresh access token");
  }

  const session: any = await findSessionById(Number(decoded.session));
  if (Array.isArray(session)) {
    if(session.length <= 0){
        return res.status(401).send("Could not refresh access token");
    }
  } else {
    if( session.affectedRows <= 0){
        return res.status(401).send("Could not refresh access token");
    }
  }

  const user: any = await findUserById(session[0].userID);
  if (Array.isArray(user)) {
    if(user.length <= 0){
        return res.status(401).send("Could not refresh access token");
    }
  } else {
    if( user.affectedRows <= 0){
        return res.status(401).send("Could not refresh access token");
    }
  }
  const tuser = {
    userID: user[0].userID,
    email: user[0].email,
    fname: user[0].fname,
    lname: user[0].lname,
  };
  const accessToken = signAccessToken(tuser);

  return res.send({ accessToken });
}
}