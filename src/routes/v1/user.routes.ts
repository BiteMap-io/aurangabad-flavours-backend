import { Router } from 'express';
import multer from 'multer';
import * as userCtrl from '../../controllers/user.controller';

const router = Router();
const upload = multer();

router.post('/', upload.single('avatar'), userCtrl.create);
router.get('/', userCtrl.list);
router.get('/:id', userCtrl.getOne);

export default router;
