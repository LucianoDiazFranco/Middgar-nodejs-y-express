import bcryptjs from "bcryptjs";


//no utilizamos bs pero lo realizamos localmente
const usuarios = [{
    user: "gf",
    email: "teste@exemplo.us",
    password: "$2a$06$UhcqmNJj1DDJy4kyFwaxveUg0oAN.zXRQ.nkLk7bwXKemf.RSXwS."
}]

function login (req,res){

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