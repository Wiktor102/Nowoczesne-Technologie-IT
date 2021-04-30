<?php
    require_once "connect.php";

    function get_articles () {
        $id = $_POST["id"];

        $conn = connect();
        $sql = "SELECT * FROM articles WHERE ArticleID='$id';";

        if ($result = $conn->query($sql)) {

            if ($result->num_rows != 1) {
                echo json_encode(array("msg" => "Taki artykuł nie istnieje!"));
                $conn->close();
                exit();
            }

            $row = $result->fetch_assoc();

            $article = array(
                "id" => $row["ArticleID"],
                "data" => $row["ArticleData"],
                "date" => date("d-m-Y", strtotime($row["ArticleDate"]))
            );

            echo json_encode($article);
        } else {
            echo json_encode(array("msg" => "Wystąpił błąd!"));
        }

        $conn->close();
    }

    get_articles();
?>