<?php
    require_once "connect.php";

    function get_articles () {
        $conn = connect();
        $sql = "SELECT ArticleID, ArticleDate, JSON_EXTRACT(ArticleData, '$.title', '$.titleImgPath', '$.introductionText') AS ArticleData FROM articles ORDER BY ArticleDate DESC;";

        if ($result = $conn->query($sql)) {
            $articles = array();

            while ($row = $result->fetch_assoc()) {

                array_push($articles, array(
                    "id" => $row["ArticleID"],
                    "data" => $row["ArticleData"],
                ));
            }

            echo json_encode($articles);
        } else {
            echo json_encode(array("msg" => "Wystąpił błąd!"));
        }

        $conn->close();
    }

    get_articles();
?>