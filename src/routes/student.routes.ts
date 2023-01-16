import  express from "express";
import {addErasmusClassStudentHandler, addUncompletedClassStudentHandler, createStudentHandler, editStudentHandler, getClassHandler, removeUncompletedClassStudentHandler, removeErasmusClassStudentHandler, addCompletedClassStudentHandler, removeCompletedClassStudentHandler } from "../controller/student.controller";
import requireUser from "../middleware/requireUser";
import validate from "../middleware/validate";
import { createStudentSchema, classStudentSchema} from "../schema/students.schema";

const router = express.Router();

router.post('/api/students/register', requireUser, validate(createStudentSchema), createStudentHandler );

router.post('/api/students/edit', requireUser, validate(createStudentSchema), editStudentHandler );

router.post('/api/students/class/uncompleted/add', requireUser, validate(classStudentSchema), addUncompletedClassStudentHandler );

router.post('/api/students/class/completed/add', requireUser, validate(classStudentSchema), addCompletedClassStudentHandler );

router.post('/api/students/erasmus/class/add', requireUser, validate(classStudentSchema), addErasmusClassStudentHandler );

router.post('/api/students/class/uncompleted/remove', requireUser, validate(classStudentSchema), removeUncompletedClassStudentHandler );

router.post('/api/students/class/completed/remove', requireUser, validate(classStudentSchema), removeCompletedClassStudentHandler );

router.post('/api/students/erasmus/class/remove', requireUser, validate(classStudentSchema), removeErasmusClassStudentHandler );

router.get("/api/students/class/get", requireUser, getClassHandler);

export default router;