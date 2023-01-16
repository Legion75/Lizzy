import  express from "express";
import { createUserHandler, deleteUserHandler, editUserHandler, verifyUserHandler } from "../controller/user.controller";
import validate from "../middleware/validate";
import { createUserSchema, deleteUserSchema, editUserSchema, verifyUserSchema } from "../schema/user.schema";
import requireUser from "../middleware/requireUser";

const router = express.Router();

router.post('/api/users/register', validate(createUserSchema), createUserHandler );

router.post('/api/users/verify/:id/:verificationCode', validate(verifyUserSchema), verifyUserHandler );

router.post('/api/users/edit', requireUser, validate(editUserSchema), editUserHandler );

router.post('/api/users/delete', requireUser, validate(deleteUserSchema), deleteUserHandler );

export default router;