import { connection } from "../utils/connectToDB";
import { CreateUserInput, EditUserInput } from "../schema/user.schema";

export async function createUser(body: CreateUserInput, hash: string, vid: string, isstudent: boolean){
  
  var IsS = 0;

  if (isstudent) {
    IsS = 1;
  }
  const conn = await connection;
  const [result] = await conn.query(
    'INSERT INTO users (email, fname, lname, password, verificationcode, verified, isstudent) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [body.email, body.firstName, body.lastName, hash, vid, 0, IsS]
  );
  return result;
}

export async function Emailexist(email:string){

    const conn = await connection;
    const [result]: any = await conn.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (Array.isArray(result)) {
        return result.length > 0;
      } else {
        console.log(result);
        return result.affectedRows > 0;
      }
}

export async function IsStudent(email:string): Promise<boolean> {

  const ex = /[A-Z0-9._%+-]+@alunos.ipca.pt/;
  if (email.match(ex)){
    return true
  }
  return false;
}

export async function userExists(id:number){

  const conn = await connection;
  const [result] = await conn.query(
      'SELECT * FROM users WHERE userID = ?',
      [id]
    );

    if (Array.isArray(result)) {
      return result.length > 0;
    } else {
      return result.affectedRows > 0;
    }
}

export async function verifyUser(id:number, vid:string): Promise<object> {

  const conn = await connection;
  const [result]: any = await conn.query(
      'SELECT * FROM users WHERE userID = ?',
      [id]
    );

    if (Array.isArray(result)) {
      if(result.length <= 0){
        return {message:"User not found", type: "error"};
      }
    } else {
      if (result.affectedRows <= 0){
        return {message:"User not found", type: "error"};
      }
    }
    if (result[0]['verified'] == 1){
      return {message:"User already verified", type: "error"};
    }
  const v: string = result[0]['verificationcode']    
  const vt:string = vid;
  if(v === vt){
     await conn.query(
      'UPDATE users SET verified = 1 WHERE userID = ?',
      [id]
    );
    return {message:"User verified!", type: "info"}
  }
  return {message:"User couldnt be verified!", type: "error"}

}

export async function EditUser(body: EditUserInput, hash: string, id: number){
  
  const conn = await connection;
  await conn.query(
    'UPDATE users SET email = ?, fname = ?, lname = ?, password = ?  WHERE userID = ?',
    [body.email, body.firstName, body.lastName, hash, id]
  );
}

export async function finduserbyemail(email:string){

  const conn = await connection;
  const [result] = await conn.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    return result;
}

export async function findUserById(id:number){

  const conn = await connection;
  const [result] = await conn.query(
      'SELECT * FROM users WHERE userID = ?',
      [id]
    );

    return result;
}

export async function deleteUser(id: number){
  
  const conn = await connection;
  

  const [students]: any = await conn.query(
    'SELECT * FROM students WHERE userID = ?',
    [id]
  );
    console.log(students);
  if (Array.isArray(students)) {
    if(students.length > 0){
      await conn.query(
        'DELETE FROM students WHERE userID = ?;',
        [id]
      );
    }
  } else {
    if (students.affectedRows > 0){
      await conn.query(
        'DELETE FROM students WHERE userID = ?;',
        [id]
      );
    }
  }

  const [uncompleted]: any = await conn.query(
    'SELECT * FROM uncompleted_classes WHERE userID = ?',
    [id]
  );
  console.log(uncompleted);
  if (Array.isArray(uncompleted)) {
    if(uncompleted.length > 0){
      await conn.query(
        'DELETE FROM uncompleted_classes WHERE userID = ?;',
        [id]
      );
    }
  } else {
    if (uncompleted.affectedRows > 0){
      await conn.query(
        'DELETE FROM uncompleted_classes WHERE userID = ?;',
        [id]
      );
    }
  }

  const [erasmus]: any = await conn.query(
    'SELECT * FROM erasmus_schedule WHERE userID = ?',
    [id]
  );
  console.log(erasmus);
  if (Array.isArray(erasmus)) {
    if(erasmus.length > 0){
      await conn.query(
        'DELETE FROM erasmus_schedule WHERE userID = ?;',
        [id]
      );
    }
  } else {
    if (erasmus.affectedRows > 0){
      await conn.query(
        'DELETE FROM erasmus_schedule WHERE userID = ?;',
        [id]
      );
    }
  }

  const [completed]: any = await conn.query(
    'SELECT * FROM completed_classes WHERE userID = ?',
    [id]
  );
  console.log(completed);
  if (Array.isArray(completed)) {
    if(completed.length > 0){
      await conn.query(
        'DELETE FROM completed_classes WHERE userID = ?;',
        [id]
      );
    }
  } else {
    if (completed.affectedRows > 0){
      await conn.query(
        'DELETE FROM completed_classes WHERE userID = ?;',
        [id]
      );
    }
  }

  const [session]: any = await conn.query(
    'SELECT * FROM session WHERE userID = ?',
    [id]
  );
  console.log(session);
  if (Array.isArray(session)) {
    if(session.length > 0){
      await conn.query(
        'DELETE FROM session WHERE userID = ?;',
        [id]
      );
    }
  } else {
    if (session.affectedRows > 0){
      await conn.query(
        'DELETE FROM session WHERE userID = ?;',
        [id]
      );
    }
  }
  await conn.query(
    'DELETE FROM users WHERE userID = ?;',
    [id]
  );

}
