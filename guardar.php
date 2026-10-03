<?php
include("conexion.php");
$nombre = $_POST["nombre"];
$edad = $_POST["edad"];
$sexo = $_POST["sexo"];
$estudio = $_POST["estudio"];
$observaciones = $_POST["observaciones"];

$sql = "INSERT INTO pacientes
(nombre, edad, sexo, estudio, observaciones)
VALUES (?, ?, ?, ?, ?)";
$consulta = $conexion->prepare($sql);
$consulta->bind_param(
    "sisss",
    $nombre,
    $edad,
    $sexo,
    $estudio,
    $observaciones
);

if ($consulta->execute()) {
    echo "Paciente guardado correctamente.";
} else {
    echo "Error al guardar: " . $conexion->error;
}
$consulta->close();
$conexion->close();
?>
