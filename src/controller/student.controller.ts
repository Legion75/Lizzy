import { Request, Response } from "express";
import { CreateStudentInput, ClassStudentInput} from "../schema/students.schema";
import { Studentexist, createStudent, editStudent, addUncompletedClassStudent, addCompletedClassStudent, addErasmusClassStudent, removeUncompletedClassStudent, removeCompletedClassStudent, removeErasmusClassStudent, ErasmusCheck, getStudent, getClasses, getUncompletedClasses, getErasmusClasses } from "../service/student.service";
import { userExists } from "../service/user.service";

export async function createStudentHandler(req: Request<{},{}, CreateStudentInput>, res: Response){

    const body = req.body;
    const id = res.locals.user.userID;
    const exist = await Studentexist(id);
    
    if(exist){
        return res.status(409).send("Student already exists")
    }

    const uexist = await userExists(id);

    if(!uexist){
        return res.status(409).send("User doesnt exists")
    }

    try {
        await createStudent(body, id);
        return res.status(200).send("student Created");
    } catch (e: any) {
        return res.status(404).send("Error: " + e.errors);
    }
}

export async function editStudentHandler(req: Request<{},{}, CreateStudentInput>, res: Response){

    const body = req.body;
    const id = res.locals.user.userID;
    const exist = await Studentexist(id);
    
    if(!exist){
        return res.status(409).send("Student doesnt exists")
    }

    try {
        await editStudent(body, id);
        return res.status(200).send("Student Edited");
    } catch (e: any) {
        return res.status(404).send("Error: " + e.errors);
    }
}

export async function addUncompletedClassStudentHandler(req: Request<{},{}, ClassStudentInput>, res: Response){

    const body = req.body;
    const id = res.locals.user.userID;
    const exist = await Studentexist(id);
    
    if(!exist){
        return res.status(409).send("Student doesnt exists")
    }

    try {
        await addUncompletedClassStudent(body, id);
        return res.status(200).send("Class added");
    } catch (e: any) {
        return res.status(404).send("Error: " + e.errors);
    }
}

export async function addCompletedClassStudentHandler(req: Request<{},{}, ClassStudentInput>, res: Response){

    const body = req.body;
    const id = res.locals.user.userID;
    const exist = await Studentexist(id);
    
    if(!exist){
        return res.status(409).send("Student doesnt exists")
    }

    try {
        await addCompletedClassStudent(body, id);
        return res.status(200).send("Class removed");
    } catch (e: any) {
        return res.status(404).send("Error: " + e.errors);
    }
}

export async function addErasmusClassStudentHandler(req: Request<{},{}, ClassStudentInput>, res: Response){

    const body = req.body;
    const id = res.locals.user.userID;
    const exist = await Studentexist(id);
    
    if(!exist){
        return res.status(409).send("Student doesnt exists")
    }

    try {
        await addErasmusClassStudent(body, id);
        return res.status(200).send("Class added");
    } catch (e: any) {
        return res.status(404).send("Error: " + e.errors);
    }
}

export async function removeUncompletedClassStudentHandler(req: Request<{},{}, ClassStudentInput>, res: Response){

    const body = req.body;
    const id = res.locals.user.userID;
    const exist = await Studentexist(id);
    
    if(!exist){
        return res.status(409).send("Student doesnt exists")
    }

    try {
        await removeUncompletedClassStudent(body,id);
        return res.status(200).send("Class removed from aditional");
    } catch (e: any) {
        return res.status(404).send("Error: " + e.errors);
    }
}

export async function removeCompletedClassStudentHandler(req: Request<{},{}, ClassStudentInput>, res: Response){

    const body = req.body;
    const id = res.locals.user.userID;

    const exist = await Studentexist(id);
    
    if(!exist){
        return res.status(409).send("Student doesnt exists")
    }

    try {
        await removeCompletedClassStudent(body,id);
        return res.status(200).send("Class removed from removed");
    } catch (e: any) {
        return res.status(404).send("Error: " + e.errors);
    }
}

export async function removeErasmusClassStudentHandler(req: Request<{},{}, ClassStudentInput>, res: Response){

    const body = req.body;
    const id = res.locals.user.userID;

    const exist = await Studentexist(id);
    
    if(!exist){
        return res.status(409).send("Student doesnt exists")
    }

    try {
        await removeErasmusClassStudent(body,id);
        return res.status(200).send("Class removed from removed");
    } catch (e: any) {
        return res.status(404).send("Error: " + e.errors);
    }
}

export async function getClassHandler(req: Request, res: Response) {
    
    const id = res.locals.user.userID;

    const exist = await Studentexist(id);
    
    if(!exist){
        return res.status(409).send("Student doesnt exists")
    }

    try {
        const erasmus = await ErasmusCheck(id);

        if(!erasmus){
            const student = await getStudent(id);

            const classes = await getClasses(student[0].courseID, student[0].year);

            const uncompleted = await getUncompletedClasses(id);

            const completed = await getUncompletedClasses(id);


            const newclasses: {classID: number}[] = [];

  
            for (const x of classes) {
    
                let matchFound = false;

    
                for (const y of completed) {
      
                    if (y.classID === x.classID) {
        
                        matchFound = true;
                    }
                }

                if (!matchFound) {
                    newclasses.push(x.classID);
                }
            }

            for (const w of uncompleted) {
                newclasses.push(w.classID);
            }

            return res.status(200).send(newclasses);
        }
        else{
            const classes = await getErasmusClasses(id);

            return res.status(200).send(classes);
        }
    } catch (e: any) {
        return res.status(404).send("Error: " + e.errors);
    }
}


