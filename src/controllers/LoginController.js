import dotenv from "dotenv";
import bcrypt from 'bcrypt';  
import pool from '../database.js';

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