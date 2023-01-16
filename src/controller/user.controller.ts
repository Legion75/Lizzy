import { Request, Response } from "express";
import { CreateUserInput, EditUserInput, VerifyUserInput, DeleteUserInput } from "../schema/user.schema";
import { Emailexist, IsStudent, createUser, verifyUser, userExists, EditUser, deleteUser } from "../service/user.service";
import sendEmail from "../utils/mailer";
import argon2 from 'argon2';
import {nanoid} from "nanoid";

export async function createUserHandler(req: Request<{},{}, CreateUserInput>, res: Response){

    const body = req.body;

    const emailexist = await Emailexist(body.email);
    
    if(emailexist){
        return res.status(409).send("Email already exists")
    }

    const hash = await argon2.hash(body.password);

    const vid = nanoid();
    
    const IsS =  await IsStudent(body.email);

    try {
        const result: any = await createUser(body, hash, vid, IsS);
        await sendEmail({
            from: 'a21113@alunos.ipca.pt',
            to: body.email,
            subject: "Please verify your account",
            text: `Verification code: ${vid}.`,
        });
        return res.status(200).send("User Created");
    } catch (e: any) {
        return res.status(409).send("Error: " + e.errors);
    }
}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response){
    const id = parseInt(req.params.id);
    const v = req.params.verificationCode;

    if (isNaN(id)) {
        return res.status(409).send("Id is not a number");
    }

    const result: any = await verifyUser(id, v);

    if(result.type === 'error'){
        return res.status(409).send("Error: " + result.message);
    }
    return res.status(200).send("Info: " + result.message);


}

export async function editUserHandler(req: Request<{},{}, EditUserInput>, res: Response){

    const body = req.body;

    const id = res.locals.user.userID;

    const exist = await userExists(id);
    
    if(!exist){
        return res.status(409).send("User doesnt exists")
    }

    const hash = await argon2.hash(body.password);

    try {
        await EditUser(body, hash, id);
        return res.status(200).send("User edited");
    } catch (e: any) {
        return res.status(409).send("Error: " + e.errors);
    }
}

export async function deleteUserHandler(req: Request<{},{}, DeleteUserInput>, res: Response){

    const body = req.body;

    const id = res.locals.user.userID;

    const exist = await userExists(id);
    
    if(!exist){
        return res.status(409).send("User doesnt exists")
    }
    console.log(body.verification);
    if(body.verification){
        console.log(id);
        try {
            await deleteUser(id);
            return res.status(200).send("User deleted");
        } catch (e: any) {
            return res.status(409).send("Error: " + e.errors);
        } 
    }
    
}
