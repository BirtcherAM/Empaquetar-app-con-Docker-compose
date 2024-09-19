document.addEventListener("DOMContentLoaded", function() { 
    const form = document.getElementById("complex-form"); 
    const tableBody = document.getElementById("table-body"); 
 
    form.addEventListener("submit", function(e) { 
        e.preventDefault();  // Prevenir el envío del formulario 
        clearErrors();       // Limpiar errores previos 
 
        let isValid = true; 
 
        // Obtener los valores de los campos del formulario 
        const firstName = document.getElementById("name").value.trim(); 
        const lastName = document.getElementById("last_name").value.trim(); 
        const email = document.getElementById("email").value.trim(); 
        const password = document.getElementById("password").value.trim(); 
        const country = document.getElementById("country").value; 
        const gender = document.querySelector('input[name="genre"]:checked'); 
        const terms = document.getElementById("accept_terms").checked; 
 
        // Validaciones 
        if (!firstName) { 
            showError("name", "El nombre es requerido"); 
            isValid = false; 
        } 
        if (!lastName) { 
            showError("last_name", "El apellido es requerido"); 
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
            showError("genre", "Por favor, seleccione un género"); 
            isValid = false; 
        } 
        if (!terms) { 
            showError("accept_terms", "Debe aceptar los términos y condiciones"); 
            isValid = false; 
        } 
 
        // Si el formulario es válido, mostrar los datos registrados en la tabla 
        if (isValid) { 
            // Agregar los datos a la tabla 
            const newRow = document.createElement("tr"); 
 
            // Crear las celdas con los valores de los campos 
            newRow.innerHTML = ` 
                <td>${firstName}</td> 
                <td>${lastName}</td> 
                <td>${email}</td> 
                <td>${country}</td> 
                <td>${gender.value}</td> 
                <td>${terms ? 'Sí' : 'No'}</td> 
            `; 
 
            // Añadir la nueva fila al cuerpo de la tabla 
            tableBody.appendChild(newRow); 
 
            // Limpiar el formulario después de enviar los datos 
            form.reset(); 
        } 
    }); 
 
    // Función para mostrar errores debajo de los campos 
    function showError(elementId, message) { 
        const errorElement = document.getElementById(elementId + "Error"); 
        errorElement.textContent = message; 
    } 
 
    // Función para limpiar todos los mensajes de error 
    function clearErrors() { 
        const errors = document.querySelectorAll(".error-message"); 
        errors.forEach(error => error.textContent = ""); 
    } 
});