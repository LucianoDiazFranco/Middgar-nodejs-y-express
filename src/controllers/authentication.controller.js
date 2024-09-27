import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//no utilizamos bs pero lo realizamos localmente
const usuarios = [{
    user: "t",
    email: "t@gmail.com",
    password: await bcryptjs.hash("a", 6) // Encriptamos la contraseña "a"
}]

async function login (req,res){
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;
     // Verificar si los campos están completos
    if(!user || !password){
        return res.status(400).send({status:"Error",message:"Los campos estan imcompletos"})
    }
    // Buscar el usuario
    const usuarioARevisar = usuarios.find(usuario => usuario.user ===user)
    if(!usuarioARevisar){
        return res.status(400).send({status:"Error",message:"Error durante el login"})
    }
    // Comparar las contraseñas
    const loginCorrecto = await bcryptjs.compare(password,usuarioARevisar.password);
    if(!loginCorrecto){
        return res.status(400).send({status:"Error",message:"Error durante el login"})
    }
    // Generar el token JWT
    const token = jsonwebtoken.sign({user:usuarioARevisar.user},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRATION});

    // Configuración de cookies
    const cookieOption={
        expires:new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
        path:"/"
    }
    res.cookie("jwt",token,cookieOption);
    res.send({status:"ok",message:"Usuario Logeado",redirect:"/admin"})
}

async function registro (req,res){//validamos que haya una contraseña en el formulario
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;
    const email = req.body.email;
    if(!user || !password || !email){
        return res.status(400).send({status:"Error",message:"Los campos estan imcompletos"})
    }
    const usuarioARevisar = usuarios.find(usuario => usuario.user ===user)
    if(usuarioARevisar){
        return res.status(400).send({status:"Error",message:"El usuario ya Existe"})
    }
    const salt = await bcryptjs.genSalt(6); //proceso de encriptacion
    const hashPassword = await bcryptjs.hash(password,salt); //incriptamos

    const nuevoUsuario = {
        user, email, password: hashPassword
    }
    usuarios.push(nuevoUsuario);
    console.log(usuarios);
    return res.status(201).send({status:"ok",message:`Usuario ${nuevoUsuario.user} agregado`,redirect:"/"});
}

export const methods = {
    login,
    registro
}