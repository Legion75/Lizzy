import  express from "express";
import user from './user.routes';
import auth from './auth.routes';
import student from './student.routes';
const router = express.Router();

router.use(user);
router.use(auth);
router.use(student);

export default router;