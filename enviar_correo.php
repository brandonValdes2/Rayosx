<?php

// =====================================
// CARGAR PHPMailer
// =====================================

require("PHPMailer/src/Exception.php");
require("PHPMailer/src/PHPMailer.php");
require("PHPMailer/src/SMTP.php");


// =====================================
// CARGAR FPDF
// =====================================

require("fpdf19/fpdf.php");


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


// =====================================
// RECIBIR DATOS
// =====================================

$nombre = $_POST["nombre"];
$edad = $_POST["edad"];
$sexo = $_POST["sexo"];
$estudio = $_POST["estudio"];
$observaciones = $_POST["observaciones"];
$correo = $_POST["correo"];


// =====================================
// RECIBIR FOTO DE LA CAMARA
// =====================================

$fotoCamara = null;

if (
    isset($_FILES["camara"]) &&
    $_FILES["camara"]["error"] == 0
) {

    $fotoCamara =
        $_FILES["camara"]["tmp_name"];

}



try {

    // =====================================
    // CREAR PDF
    // =====================================

    $pdf = new FPDF();

    $pdf->AddPage();


    // =====================================
    // TITULO
    // =====================================

    $pdf->SetFont("Arial", "B", 18);

    $pdf->Cell(
        0,
        15,
        "REPORTE DE RAYOS X",
        0,
        1,
        "C"
    );

    $pdf->Ln(5);


    // =====================================
    // DATOS DEL PACIENTE
    // =====================================

    $pdf->SetFont("Arial", "B", 12);

    $pdf->Cell(40, 10, "Paciente:");

    $pdf->SetFont("Arial", "", 12);

    $pdf->Cell(
        0,
        10,
        $nombre,
        0,
        1
    );


    $pdf->SetFont("Arial", "B", 12);

    $pdf->Cell(40, 10, "Edad:");

    $pdf->SetFont("Arial", "", 12);

    $pdf->Cell(
        0,
        10,
        $edad . " anos",
        0,
        1
    );


    $pdf->SetFont("Arial", "B", 12);

    $pdf->Cell(40, 10, "Sexo:");

    $pdf->SetFont("Arial", "", 12);

    $pdf->Cell(
        0,
        10,
        $sexo,
        0,
        1
    );


    $pdf->SetFont("Arial", "B", 12);

    $pdf->Cell(40, 10, "Estudio:");

    $pdf->SetFont("Arial", "", 12);

    $pdf->Cell(
        0,
        10,
        $estudio,
        0,
        1
    );


    // =====================================
    // OBSERVACIONES
    // =====================================

    $pdf->Ln(5);

    $pdf->SetFont("Arial", "B", 12);

    $pdf->Cell(
        0,
        10,
        "Observaciones:",
        0,
        1
    );


    $pdf->SetFont("Arial", "", 11);

    $observacionesPDF = iconv(
        "UTF-8",
        "windows-1252//TRANSLIT",
        $observaciones
    );

    $pdf->MultiCell(
        0,
        8,
        $observacionesPDF
    );

// =====================================
// FOTO DE LA CAMARA
// =====================================

if ($fotoCamara != null) {

    // Foto pequeña arriba a la derecha
    // 23 mm = 2.3 cm

    $pdf->Image(
        $fotoCamara,
        165,
        20,
        23,
        23
    );
}


    // =====================================
    // AGREGAR IMAGEN DE RAYOS X
    // =====================================

    if (
        isset($_FILES["imagen"]) &&
        $_FILES["imagen"]["error"] == 0
    ) {

        // Obtener nombre de la imagen

        $nombreImagen =
            $_FILES["imagen"]["name"];


        // Obtener extensión

        $extension = strtolower(
            pathinfo(
                $nombreImagen,
                PATHINFO_EXTENSION
            )
        );


        // Comprobar formato

        if (
            $extension == "jpg" ||
            $extension == "jpeg" ||
            $extension == "png"
        ) {

            // Crear archivo temporal

            $imagenTemporal =
                tempnam(
                    sys_get_temp_dir(),
                    "rayosx_"
                );


            $imagenTemporalConExtension =
                $imagenTemporal .
                "." .
                $extension;


            // Mover imagen temporal

            move_uploaded_file(
                $_FILES["imagen"]["tmp_name"],
                $imagenTemporalConExtension
            );


            // Titulo de imagen

            $pdf->Ln(8);

            $pdf->SetFont(
                "Arial",
                "B",
                12
            );

            $pdf->Cell(
                0,
                10,
                "Imagen de Rayos X:",
                0,
                1
            );


            // Agregar imagen al PDF

$pdf->Image(
    $imagenTemporalConExtension,
    45,
    $pdf->GetY(),
    100
);



            // Eliminar imagen temporal

            unlink(
                $imagenTemporalConExtension
            );
        }
    }


    // =====================================
    // CREAR PDF TEMPORAL
    // =====================================

    $archivoPDF =
        sys_get_temp_dir() .
        "/reporte_rayosx_" .
        time() .
        ".pdf";


    $pdf->Output(
        "F",
        $archivoPDF
    );


    // =====================================
    // CONFIGURAR PHPMailer
    // =====================================

    $mail = new PHPMailer(true);

    $mail->isSMTP();

    $mail->Host = "smtp.gmail.com";

    $mail->SMTPAuth = true;


    // TU CORREO DE GMAIL

    $mail->Username =
        "brandonvaldes761@gmail.com";


    // CONTRASEÑA DE APLICACIÓN

    $mail->Password =
        "yfdo psvx blqr zbkq";


    $mail->SMTPSecure =
        PHPMailer::ENCRYPTION_STARTTLS;

    $mail->Port = 587;


    // =====================================
    // REMITENTE
    // =====================================

    $mail->setFrom(
        "TU_CORREO@gmail.com",
        "Simulador de Rayos X"
    );


    // =====================================
    // DESTINATARIO
    // =====================================

    $mail->addAddress(
        $correo
    );


    // =====================================
    // ASUNTO
    // =====================================

    $mail->Subject =
        "Reporte de Rayos X";


    // =====================================
    // MENSAJE
    // =====================================

    $mail->Body =
        "Hola.\n\n" .
        "Se ha generado un reporte de Rayos X.\n\n" .
        "Paciente: " . $nombre . "\n" .
        "Edad: " . $edad . "\n" .
        "Sexo: " . $sexo . "\n" .
        "Estudio: " . $estudio . "\n\n" .
        "El reporte completo se encuentra " .
        "en el PDF adjunto.\n\n" .
        "Simulador de Rayos X";


    // =====================================
    // ADJUNTAR PDF
    // =====================================

    $mail->addAttachment(
        $archivoPDF,
        "reporte_rayosx.pdf"
    );


    // =====================================
    // ENVIAR
    // =====================================

    $mail->send();


    // Eliminar PDF temporal

    unlink(
        $archivoPDF
    );


    echo "Correo enviado correctamente.";

}
catch (Exception $e) {

    echo "Error al enviar el correo: " .
         $mail->ErrorInfo;

}

?>
