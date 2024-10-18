import { Router } from 'express'
import { login, auth, register, storeUser, logout , sendRecoveryEmail, mostrarResetPasswordForm, procesarResetPassword } from '../controllers/LoginController.js';


const router = Router();

router.get('/login', login);
router.post('/login', auth);
router.get('/register', register);
router.post('/register', storeUser);
router.get('/logout', logout);
router.post('/rec_password', sendRecoveryEmail);
router.get('/reset_password/:token', mostrarResetPasswordForm);
router.post('/reset_password/:token', procesarResetPassword);

export default router;