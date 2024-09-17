document.getElementById("registro-form").addEventListener("submit",async(e)=>{
    e.preventDefault();
    console.log(e.target.children.user.value)
    const res= await fetch("http://localhost:3000/api/registro",{
        method:"POST",
        headers:{
            "Content-type" : "application/json"
        },
        body: JSON.stringify({
            user: e.target.children.user.value,
            email: e.target.children.email.value
        })
    })
})
