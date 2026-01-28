import { Router } from 'express';
// import multer from 'multer';
import userCtrl from '../../controllers/user.controller';

const router = Router();
// const upload = multer();

router.post('/', userCtrl.createUser);
router.get('/:id', userCtrl.getUserById);

export default router;
