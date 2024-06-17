// routes/upload.routes.js
import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { loginUser, registerUser } from '../controllers/user.controller.js';
const router = Router();

router.post('/register', 
  upload.fields([
    { name: 'avatar', maxCount: 1 }, 
    { name: 'coverImage', maxCount: 1 }
  ])
  , registerUser);
  router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logOutUser)
export default router;
