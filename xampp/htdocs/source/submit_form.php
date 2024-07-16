<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $locations = $_POST['location'];

    foreach ($locations as $index => $location) {
        echo "위치 " . ($index + 1) . ": " . htmlspecialchars($location) . "<br>";
    }
}
?>