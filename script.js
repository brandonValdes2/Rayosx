// Obtener los elementos de la página
const imagen = document.getElementById("imagen");
const imagenPreview = document.getElementById("imagenPreview");
const mensaje = document.getElementById("mensaje");
const brillo = document.getElementById("brillo");
const contraste = document.getElementById("contraste");


// Mostrar la imagen seleccionada

imagen.addEventListener("change", function() {

    const archivo = imagen.files[0];

    if (archivo) {

        const lector = new FileReader();

        lector.onload = function(e) {

            imagenPreview.src = e.target.result;

            imagenPreview.style.display = "block";

            mensaje.style.display = "none";

        };

        lector.readAsDataURL(archivo);
    }

});


// Cambiar brillo

brillo.addEventListener("input", function() {

    actualizarImagen();

});


// Cambiar contraste

contraste.addEventListener("input", function() {

    actualizarImagen();

});


// Aplicar filtros

function actualizarImagen() {

    imagenPreview.style.filter =
        "brightness(" + brillo.value + "%) " +
        "contrast(" + contraste.value + "%)";

}


// Invertir imagen

function invertirImagen() {

    imagenPreview.style.filter =
        "brightness(" + brillo.value + "%) " +
        "contrast(" + contraste.value + "%) " +
        "invert(1)";

}


// Restablecer imagen

function restablecerImagen() {

    brillo.value = 100;

    contraste.value = 100;

    imagenPreview.style.filter = "none";

}


// Generar reporte

function generarReporte() {

    const nombre = document.getElementById("nombre").value;
    const edad = document.getElementById("edad").value;
    const sexo = document.getElementById("sexo").value;
    const estudio = document.getElementById("estudio").value;
    const observaciones =
        document.getElementById("observaciones").value;


    document.getElementById("resultado").innerHTML =

        "<h3>Reporte de Rayos X</h3>" +

        "<p><b>Paciente:</b> " + nombre + "</p>" +

        "<p><b>Edad:</b> " + edad + "</p>" +

        "<p><b>Sexo:</b> " + sexo + "</p>" +

        "<p><b>Estudio:</b> " + estudio + "</p>" +

        "<p><b>Observaciones:</b> " +
        observaciones + "</p>";

}

// Guardar paciente en MySQL
function guardarPaciente() {

    // Obtener los datos del formulario

    const nombre = document.getElementById("nombre").value;
    const edad = document.getElementById("edad").value;
    const sexo = document.getElementById("sexo").value;
    const estudio = document.getElementById("estudio").value;
    const observaciones =
        document.getElementById("observaciones").value;


    // Comprobar que los datos principales estén llenos

    if (nombre === "" ||
        edad === "" ||
        sexo === "" ||
        estudio === "") {

        alert("Por favor completa todos los datos del paciente.");

        return;
    }


    // Crear los datos que enviaremos a PHP

    const datos = new FormData();

    datos.append("nombre", nombre);
    datos.append("edad", edad);
    datos.append("sexo", sexo);
    datos.append("estudio", estudio);
    datos.append("observaciones", observaciones);


    // Enviar los datos a guardar.php

    fetch("guardar.php", {

        method: "POST",

        body: datos

    })

    .then(respuesta => respuesta.text())

    .then(resultado => {

        alert(resultado);

    })

    .catch(error => {

        alert("Ocurrió un error.");

        console.log(error);

    });

}

// Descargar reporte TXT
function descargarFormato(formato) {
    const nombre =document.getElementById("nombre").value;
    const edad =document.getElementById("edad").value;
    const sexo =
        document.getElementById("sexo").value;

    const estudio =
        document.getElementById("estudio").value;

    const observaciones =
        document.getElementById("observaciones").value;


    // Comprobar datos

    if (nombre === "" ||
        edad === "" ||
        sexo === "" ||
        estudio === "") {

        alert("Completa los datos del paciente primero.");

        return;
    }


    // Crear los datos

    const datos = new FormData();

    datos.append("nombre", nombre);
    datos.append("edad", edad);
    datos.append("sexo", sexo);
    datos.append("estudio", estudio);
    datos.append("observaciones", observaciones);

    // Enviar a PHP

    fetch("formatos/generar_txt.php", {

        method: "POST",

        body: datos

    })

    .then(respuesta => respuesta.blob())

    .then(blob => {

        const url =
            window.URL.createObjectURL(blob);

        const enlace =
            document.createElement("a");

        enlace.href = url;

        enlace.download =
            "reporte_rayosx.txt";

        enlace.click();

        window.URL.revokeObjectURL(url);

    })

    .catch(error => {

        console.log(error);

        alert("Error al generar el TXT.");

    });

}

// Descargar reporte PDF

function descargarPDF() {

    const nombre = document.getElementById("nombre").value;
    const edad = document.getElementById("edad").value;
    const sexo = document.getElementById("sexo").value;
    const estudio = document.getElementById("estudio").value;
    const observaciones =
        document.getElementById("observaciones").value;


    // Comprobar datos

    if (nombre === "" ||
        edad === "" ||
        sexo === "" ||
        estudio === "") {

        alert("Completa los datos del paciente primero.");

        return;
    }


    // Crear los datos

    const datos = new FormData();

    datos.append("nombre", nombre);
    datos.append("edad", edad);
    datos.append("sexo", sexo);
    datos.append("estudio", estudio);
    datos.append("observaciones", observaciones);


    // Agregar imagen de Rayos X

    const archivoImagen =
        document.getElementById("imagen").files[0];

    if (archivoImagen) {

        datos.append("imagen", archivoImagen);

    }


    // Enviar a generar_pdf.php

    fetch("formatos/generar_pdf.php", {

        method: "POST",

        body: datos

    })

    .then(respuesta => {

        if (!respuesta.ok) {

            throw new Error(
                "Error del servidor: " + respuesta.status
            );

        }

        return respuesta.blob();

    })

    .then(blob => {

        const url =
            window.URL.createObjectURL(blob);

        const enlace =
            document.createElement("a");

        enlace.href = url;

        enlace.download =
            "reporte_rayosx.pdf";

        document.body.appendChild(enlace);

        enlace.click();

        enlace.remove();

        window.URL.revokeObjectURL(url);

    })

    .catch(error => {

        console.log(error);

        alert("Error al generar el PDF.");

    });

}

// =====================================
// ENVIAR REPORTE POR CORREO
// =====================================

function enviarCorreo() {

    // Obtener datos del paciente

    const nombre =
        document.getElementById("nombre").value;

    const edad =
        document.getElementById("edad").value;

    const sexo =
        document.getElementById("sexo").value;

    const estudio =
        document.getElementById("estudio").value;

    const observaciones =
        document.getElementById("observaciones").value;

    const correo =
        document.getElementById("correo").value;


    // Comprobar que los datos estén completos

    if (
        nombre === "" ||
        edad === "" ||
        sexo === "" ||
        estudio === "" ||
        correo === ""
    ) {

        alert(
            "Completa los datos del paciente y el correo."
        );

        return;
    }


    // Crear los datos para enviar

    const datos = new FormData();

    datos.append("nombre", nombre);
    datos.append("edad", edad);
    datos.append("sexo", sexo);
    datos.append("estudio", estudio);
    datos.append("observaciones", observaciones);
    datos.append("correo", correo);

    const archivoImagen =
    document.getElementById("imagen").files[0];

if (archivoImagen) {

    datos.append(
        "imagen",
        archivoImagen
    );

}

// =====================================
// AGREGAR FOTO DE LA CAMARA
// =====================================

const fotoCamara =
    document.getElementById("camara").files[0];

if (fotoCamara) {

    datos.append(
        "camara",
        fotoCamara
    );

}


    // Mostrar mensaje

    alert("Enviando reporte por correo...");


    // Enviar información a PHP

    fetch("enviar_correo.php", {

        method: "POST",

        body: datos

    })

    .then(respuesta => respuesta.text())

    .then(resultado => {

        alert(resultado);

    })

    .catch(error => {

        console.log(error);

        alert(
            "Ocurrió un error al enviar el correo."
        );

    });

}

// =====================================
// ABRIR CAMARA
// =====================================

function abrirCamara() {

    document.getElementById("camara").click();

}

