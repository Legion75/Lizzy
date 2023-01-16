import { connection } from "../utils/connectToDB";
import { CreateStudentInput, ClassStudentInput } from "../schema/students.schema";

export async function createStudent(body: CreateStudentInput, id: number){
  
  const conn = await connection;
  await conn.query(
    'INSERT INTO students (courseID, erasmus, userID, year) VALUES (?, ?, ?, ?)',
    [body.courseID, body.erasmus, id, body.year]
  );
}

export async function Studentexist(id:number){

    const conn = await connection;
    const [result]: any = await conn.query(
        'SELECT * FROM students WHERE userID = ?',
        [id]
      );

      if (Array.isArray(result)) {
        return result.length > 0;
      } else {
        
        return result.affectedRows > 0;
      }
}

export async function editStudent(body: CreateStudentInput, id: number){
  
    const conn = await connection;
    await conn.query(
      'UPDATE students SET courseID = ?, erasmus = ?, year = ?  WHERE userID = ?',
      [body.courseID, body.erasmus, body.year, id]
    );
}

export async function addUncompletedClassStudent(body: ClassStudentInput, id: number){
  
  const conn = await connection;
  await conn.query(
    'INSERT INTO uncompleted_classes (userID, classID) VALUES (?, ?)',
    [id, body.classID]
  );
}

export async function addCompletedClassStudent(body: ClassStudentInput, id: number){
  
  const conn = await connection;
  await conn.query(
    'INSERT INTO completed_classes (userID, classID) VALUES (?, ?)',
    [id, body.classID]
  );
}

export async function addErasmusClassStudent(body: ClassStudentInput, id: number){
  
  const conn = await connection;
  await conn.query(
    'INSERT INTO erasmus_schedule (userID, classID) VALUES (?, ?)',
    [id, body.classID]
  );
}

export async function removeUncompletedClassStudent(body: ClassStudentInput, id: number){
  
  const conn = await connection;
  await conn.query(
    'DELETE FROM uncompleted_classes WHERE userID = ? and classID = ?;',
    [id, body.classID]
  );
}

export async function removeCompletedClassStudent(body: ClassStudentInput, id: number){
  
  const conn = await connection;
  await conn.query(
    'DELETE FROM completed_classes WHERE userID = ? and classID = ?;',
    [id, body.classID]
  );
}

export async function removeErasmusClassStudent(body: ClassStudentInput, id: number){
  
  const conn = await connection;
  await conn.query(
    'DELETE FROM erasmus_schedule WHERE userID = ? and classID = ?;',
    [id, body.classID]
  );
}

export async function ErasmusCheck(id:number){

  const conn = await connection;
  const [result]: any = await conn.query(
      'SELECT * FROM students WHERE userID = ?',
      [id]
    );

    if (result[0].erasmus == 1) {
      return true;
    } else {
      return false;
    }
}

export async function getClasses(id:number, year:number){

  const conn = await connection;
  const [result]: any = await conn.query(
      'SELECT * FROM class_course WHERE courseID = ? and year = ?',
      [id, year]
    );

  return result;
}

export async function getStudent(id:number){

  const conn = await connection;
  const [result]: any = await conn.query(
      'SELECT * FROM students WHERE userID = ?',
      [id]
    );

  return result;
}

export async function getUncompletedClasses(id:number){

  const conn = await connection;
  const [result]: any = await conn.query(
      'SELECT * FROM uncompleted_classes WHERE userID = ?',
      [id]
    );

  return result;
}

export async function getCompletedClasses(id:number){

  const conn = await connection;
  const [result]: any = await conn.query(
      'SELECT * FROM completed_classes WHERE userID = ?',
      [id]
    );

  return result;
}

export async function getErasmusClasses(id:number){

  const conn = await connection;
  const [result]: any = await conn.query(
      'SELECT * FROM erasmus_schedule WHERE userID = ?',
      [id]
    );

  return result;
}
