<?php
include 'config.php';

$bdd = new PDO('mysql:host=localhost;dbname=monopoly;charset=utf8', 'root', $password);

$bdd->exec("UPDATE properties SET owner_id = NULL, nbHouses = 0, hypothecated = 0, doubled = 0 WHERE id > 0");
$bdd->exec("UPDATE users SET credit = 3500, nbGares = 0, nbCompagnies = 0 WHERE id > 0");
$bdd->exec("UPDATE free_parking SET amount = 0");

?>