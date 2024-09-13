document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("myForm");
    const output = document.getElementById("form-output");

    form.addEventListener("submit", function(e) {
        e.preventDefault();  // Prevenir el envío del formulario
        clearErrors();       // Limpiar errores previos

        let isValid = true;

        // Obtener los valores de los campos del formulario
        const firstName = document.getElementById("first-name").value.trim();
        const lastName = document.getElementById("last-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const country = document.getElementById("country").value;
        const gender = document.querySelector('input[name="gender"]:checked');
        const terms = document.getElementById("terms").checked;

        // Validaciones
        if (!firstName) {
            showError("first-name", "El nombre es requerido");
            isValid = false;
        }
        if (!lastName) {
            showError("last-name", "El apellido es requerido");
            isValid = false;
        }
        if (!email) {
            showError("email", "El correo electrónico es requerido");
            isValid = false;
        }
        if (!password) {
            showError("password", "La contraseña es requerida");
            isValid = false;
        }
        if (!country) {
            showError("country", "Por favor, seleccione un país");
            isValid = false;
        }
        if (!gender) {
            showError("gender", "Por favor, seleccione un género");
            isValid = false;
        }
        if (!terms) {
            showError("terms", "Debe aceptar los términos y condiciones");
            isValid = false;
        }

        // Si el formulario es válido, mostrar los datos ingresados
        if (isValid) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "name": firstName,
                "last_name": lastName,
                "email": email,
                "password": password,
                "country": getCountryName(country),
                "genre": gender.value === 'male' ? 'Masculino' : 'Femenino',
                "accept_terms": terms
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            const host = 'http://localhost:8000'

            fetch(`${host}/register`, requestOptions)
                .then((_response) => {
                    output.innerHTML = `<h3> Datos Registrado!</h3> `
                })
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
        }
    });

    // Función para mostrar errores debajo de los campos
    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        const error = document.createElement("div");
        error.className = "error";
        error.textContent = message;
        element.parentNode.insertBefore(error, element.nextSibling);
    }

    // Función para limpiar todos los mensajes de error
    function clearErrors() {
        const errors = document.querySelectorAll(".error");
        errors.forEach(error => error.remove());
    }

    // Función para obtener el nombre del país a partir del valor
    function getCountryName(value) {
        switch (value) {
            case 'mx': return 'México';
            case 'us': return 'Estados Unidos';
            case 'es': return 'Guatemala';
            default: return 'No seleccionado';
        }
    }
});
