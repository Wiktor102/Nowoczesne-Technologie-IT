//funkcje ładujące i pokazujące komentarze
const get_comments_html = async (id, comments = null) => {
    let html = "";

    try {

        if (comments == null) {
            comments = await get_comments(id);

            if (comments.length <= 0) {
                return '<p class="empty">Brak komentarzy</p>';
            }
        }

        comments.forEach(({ user, date, text }) => {
            html += `
                <div class="comment">
                    <header class="comment__header">
                        <div class="comment__username">${user}</div>
                        <div class="comment__date">${date}</div>
                    </header>
                    <div class="comment__content">${text}</div>
                </div>
            `;
        });

    } catch (err) {
        console.error(err);
    }

    return html;
}

const get_comments = id => {
    return new Promise((resolve, reject) => {
        $.ajax({ url: "get_comments.php", method: "POST", data: { articleID: id }, dataType: "json" })
            .done(resp => { resolve(resp) })
            .fail(err => { reject(err) });
    });
}

const saveComment = (article_id, commentData) => {
    return new Promise((resolve, reject) => {
        $.ajax({ url: "save_comment.php", method: "POST", data: { articleID: article_id, comment: commentData }, dataType: "json" })
            .done(resp => { if (resp.msg !== "") { reject(resp) } resolve(resp) })
            .fail(err => { reject(err) });
    });
}

const displayNewComment = async (commentData, articleId) => {
    $(await get_comments_html(null, [commentData])).prependTo(`.comments[data-id=${articleId}] .comments__container`);
    $(`.comments[data-id=${articleId}] .comments__container > p.empty`).remove();
}

//eventy
$('body').on("click", '.comments__add_comment', function () {
    const id = $(this).parent().data("id");
    $(`.comments[data-id=${id}] > .comments__add_comment`).hide();
    $(`.comments[data-id=${id}] > .comments__container`).slideUp(500);
    $(`.comments[data-id=${id}] > .form`).delay(450).slideDown(500);
    $(`.comments[data-id=${id}] > .back.to_comments`).delay(500).fadeIn(0);
});

$('body').on("click", 'article .back.to_comments', function () {
    const id = $(this).parent().data("id");
    $(`.comments[data-id=${id}] > .back.to_comments`).hide();
    $(`.comments[data-id=${id}] > .form`).slideUp(500);
    $(`.comments[data-id=${id}] > .comments__container`).delay(500).slideDown(500);
    $(`.comments[data-id=${id}] > .comments__add_comment`).delay(500).fadeIn(0);
});

$('body').on("click", '.comment__publish', async function () {
    const articleId = $(this).parent().parent().data("id");

    //pobieranie komentarza z formularza
    const username = $(`.comments[data-id=${articleId}] .form .comment__username`).val();
    const text = $(`.comments[data-id=${articleId}] .form .comment__text`).val();
    const comment = {
        user: username,
        text: text
    };

    //zapisywanie komentarza w bazie danych
    try {
        const resp = await saveComment(articleId, comment);
        displayNewComment(resp, articleId); //Wyświetlanie nowo dodanego komentarza
        $(`article[data-id=${articleId}] .back.to_comments`).click();

    } catch (e) {
        console.error(e);
        alert("Wystąpił Błąd!" + e.msg); //tymczasowo
    }
});

export { get_comments_html };

//© Wiktor Golicz 2021 - WSZELKIE PRAWA ZASTRZEŻONE