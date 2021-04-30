<?php
    //$var = '[ { "user": "Admin1234", "date": "18-04-2021", "text": "Oto testowy komentarz do wyświetlenia." }, { "user": "Admin1234", "date": "18-04-2021", "text": "Oto długi testowy komentarz do wyświetlenia. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." }, { "user": "Admin1234", "date": "18-04-2021", "text": "Oto testowy komentarz do wyświetlenia." }, { "user": "Admin1234", "date": "18-04-2021", "text": "Oto długi testowy komentarz do wyświetlenia. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." } ]';
    //echo json_encode($var, JSON_UNESCAPED_UNICODE);
    require_once "connect.php";

    function getComments () {
        $articleID = $_POST["articleID"];
        $conn = connect();
        $sql = "SELECT * FROM comments WHERE articleID = '$articleID';";

        if ($result = $conn->query($sql)) {
            $commentsArray = array();

            while ($row = $result->fetch_assoc()) {
                array_push($commentsArray, json_decode($row["CommentData"]));
            }

            echo json_encode($commentsArray, JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(array("msg" => "Coś poszło nie tak!", "err" => $conn->error), JSON_UNESCAPED_UNICODE);
        }

        $conn->close();
    }

    getComments();
?>