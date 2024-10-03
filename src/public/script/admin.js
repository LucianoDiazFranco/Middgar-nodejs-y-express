document.getElementById("but").addEventListener("click", () => {
    // Borrar la cookie JWT
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // Redirigir a la página de inicio de sesión
    document.location.href = "/";
});


