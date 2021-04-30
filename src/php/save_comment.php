<?php
    require_once "connect.php";
    $commentData = $_POST["comment"];

    function saveComment () {
        global $commentData;
        $json = json_encode($commentData, JSON_UNESCAPED_UNICODE);
        $articleID = $_POST["articleID"];

        $conn = connect();
        $sql = "INSERT INTO comments VALUES (NULL, '$json', '$articleID');";

        if ($conn->query($sql) === TRUE) {
            $commentData["CommentID"] = $conn->insert_id;
            $commentData["msg"] = "";
            echo json_encode($commentData, JSON_UNESCAPED_UNICODE);
        } else {
            //Niepowodzenie
            echo json_encode(array("msg" => "Coś poszło nie tak!", "err" => $conn->error), JSON_UNESCAPED_UNICODE);
        }

        $conn->close();
    }

    function validateInput () {
        global $commentData;

        //walidacja długośći wartości wpisanych przez użytkownika. Jeśli nie pomyślnie, skrypt zatrzyma się i wyśle odpowiedź w formacie JSON.
        if (strlen($commentData["user"]) < 3) {exit(json_encode(array("msg" => "Nazwa użytkownika musi mieć co najmniej 3 znaki!"), JSON_UNESCAPED_UNICODE));}
        if (strlen($commentData["text"]) < 1) {exit(json_encode(array("msg" => "Wpisz treść komentarza!"), JSON_UNESCAPED_UNICODE));}
        return true;
    }

    //Funkcja dodająca datę komentarza
    function processComment () {
        global $commentData;
        $commentData["date"] = date("Y-m-d H:i");
    }

    if (validateInput()) {
        processComment();
        saveComment();
    }

    //© Wiktor Golicz 2021 - WSZELKIE PRAWA ZASTRZEŻONE
?>