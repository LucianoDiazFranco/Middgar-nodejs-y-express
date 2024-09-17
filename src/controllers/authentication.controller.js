//no utilizamos bs pero lo realizamos localmente
const usuarios = [{
    user: "a",
    email: "a@gs.com",
    password: "a"
}]



function login (req,res){

}

function registro (req,res){//validamos que haya una contraseña en el formulario
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;
    const email = req.body.email;
    if(!user || !password || !email){
        res.status(400).send({status:"Error",message:"Los campos estan imcompletos"})
    }
    const usuarioARevisar = usuarios.find(usuario => usuario.user ===user)
    if(usuarioARevisar){
        res.status(400).send({status:"Error",message:"El usuario ya Existe"})
    }
}

export const methods = {
    login,
    registro
}