import dotenv from "dotenv";
import bcrypt from 'bcrypt';  
import pool from '../database.js';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

dotenv.config();

export const login = (req, res) => {
    if (req.session.loggedin != true) {
        res.render('paginas/inicio_secion');
    } else {
        res.redirect('/');
    }
};

export const auth = async (req, res) => {
    const data = req.body;
    try {
        const [userdata] = await pool.query('SELECT * FROM users WHERE email = ?', [data.email]);
        if (userdata.length > 0) {
            const user = userdata[0];
            const isMatch = await bcrypt.compare(data.password, user.password);
            if (!isMatch) {
                return res.render('paginas/inicio_secion', { error: 'Error: Contraseña Incorrecta', email: data.email });
            }
            req.session.loggedin = true;
            req.session.name = user.name;
            res.redirect('/');
        } else {
            return res.render('paginas/inicio_secion', { error: 'Error: El usuario no existe!', email: data.email });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en la base de datos");
    }
};

export const register = (req, res) => {
    if (req.session.loggedin != true) {
        res.render('paginas/registro');
    } else {
        res.redirect('paginas/index');
    }
};

export const storeUser = async (req, res) => {
    const data = req.body;
    console.log("Correo recibido:", data.email);
    try {
        // Verifica si el usuario ya existe
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [data.email]);
        if (rows.length > 0) {
            return res.render('paginas/registro', { error: 'Error: El usuario ya existe!' });
        }

        // Si el usuario no existe, encripta la contraseña
        const hash = await bcrypt.hash(data.password, 12);
        data.password = hash;

        // Inserta el nuevo usuario en la base de datos
        await pool.query('INSERT INTO users SET ?', [data]);

        // Establece la sesión y redirige
        req.session.loggedin = true;
        req.session.name = data.name;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en la base de datos");
    }
};

export const logout = (req, res) => {
    if (req.session.loggedin == true) {
        req.session.destroy();
    }
    res.redirect('/inicio_secion');
};

export const sendRecoveryEmail = async (req, res) => {
    const { email } = req.body;  // Obtén el correo del formulario
    console.log("Correo recibido:", email);
    // Verificar si el email existe en la base de datos
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
        // Generar un token seguro para restablecer la contraseña
        console.log("Usuario encontrado:", rows[0]);
        const token = randomBytes(32).toString('hex');
        const user = rows[0];

        console.log("Token generado:", token);
        // Almacenar el token en la base de datos con una expiración
        await pool.query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?', [token, Date.now() + 3600000, email]); // 1 hora de validez
        console.log("Token almacenado en la base de datos");
        // Crear el enlace de restablecimiento de contraseña
        const resetLink = `http://localhost:3000/reset_password/${token}`;
        console.log("Enlace de restablecimiento generado:", resetLink);
        // Configuración de nodemailer para enviar correos
        const mailOptions = {
            from: 'middgaar@gmail.com',  // Tu correo (el remitente)
            to: email,  // El correo del usuario ingresado en el formulario
            subject: 'Recupera tu contraseña - Midgar',
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error al enviar el correo:", err);
                return res.status(500).send('Error al enviar el correo electrónico');
            }
            console.log("Correo enviado:", info.response);
            res.render('rec_password', { success: 'Se ha enviado un enlace a tu correo electrónico para restablecer la contraseña.' });
        });

    } else {
        console.log("Usuario no encontrado");
        res.render('rec_password', { error: 'No se encontró un usuario con ese correo electrónico' });
    }
};

export const mostrarResetPasswordForm = async (req, res) => {
    const { token } = req.params;

    try {
        // Buscar si el token es válido y no ha expirado
        const [rows] = await pool.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?', [token, Date.now()]);

        if (rows.length === 0) {
            return res.render('reset_password', { error: 'El token es inválido o ha expirado.' });
        }

        // Mostrar la página para ingresar la nueva contraseña
        res.render('reset_password', { token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor.');
    }
};

export const procesarResetPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.render('reset_password', { error: 'Las contraseñas no coinciden.', token });
    }

    try {
        // Verificar que el token sea válido y no haya expirado
        const [rows] = await pool.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?', [token, Date.now()]);

        if (rows.length === 0) {
            return res.render('reset_password', { error: 'El token es inválido o ha expirado.' });
        }

        const user = rows[0];

        // Encriptar la nueva contraseña
        const hash = await bcrypt.hash(password, 12);

        // Actualizar la contraseña y borrar el token de la base de datos
        await pool.query('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [hash, user.id]);

        res.render('reset_password', { success: 'Tu contraseña ha sido actualizada exitosamente.' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al restablecer la contraseña.');
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'middgaar@gmail.com',
        pass: 'scout5824'
    }
});