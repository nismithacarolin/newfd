<?php
include "db.php";

$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$reg = $_POST['reg_no'];
$spec = $_POST['specialization'];
$exp = $_POST['experience'];

$sql = "INSERT INTO detail 
(name, email, phone, reg_no, specialization, experience)
VALUES
('$name', '$email', '$phone', '$reg', '$spec', '$exp')";

if (mysqli_query($conn, $sql)) {
    echo "success";
} else {
    echo "error";
}
?>
