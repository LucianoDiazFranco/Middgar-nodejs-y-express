import { Router } from 'express'
import { login, auth, register, storeUser, logout} from '../controllers/LoginController.js';



const router = Router();

router.get('/login', login);
router.post('/login', auth);
router.get('/register', register);
router.post('/register', storeUser);
router.get('/logout', logout);
export default router;