const set_classes = () => {
    let img_count = $('.newest_articles__image').length;
    const elements = $('.newest_articles__image').not(function (i, e) {
        if (img_count % 2 !== 0 && img_count == i - 1) {return true;}
    });

    if (img_count % 2 == 0) {
        $('.newest_articles__image').last().hide();
        img_count --;
    }

    elements.each(function (i) {
        $(this).children('img').removeClass();

        if (i == (img_count - 1) / 2) {
            $(this).children('img').addClass("image_big");
            $(this).show();
            return true;
        }

        if (i == ((img_count - 1) / 2) - 1 || i == ((img_count - 1) / 2) + 1) {
            $(this).children('img').addClass("image_small");
            $(this).show();
            return true;
        }

        $(this).hide();
    });
}

const get_newest_articles = new Promise((resolve, reject) => {
    $.ajax({ url: "get_newest_articles.php", dataType: "json"})
    .done((data) => resolve(data))
    .fail((err) => reject(err));
});

get_newest_articles.then((data) => {

    data.forEach((v) => {
        v.data = JSON.parse(v.data);
        $(`
        <div class="newest_articles__image">
            <img src="${v.data[1]}" alt="${v.data[0]}">
            <p>${v.data[0]}</p>
        </div>
        `).appendTo('.newest_articles__images').data("id", v.id)
    });

    set_classes();
})
.catch((err) => {console.error(err)});

$('.newest_articles__arrow__left').click(() => {
    $('.newest_articles__image').last().prependTo('.newest_articles__images');
    set_classes();
});

$('.newest_articles__arrow__right').click(() => {
    $('.newest_articles__image').first().appendTo('.newest_articles__images');
    set_classes();
});

$('body').on("click", '.newest_articles__image', function () {window.location.href = `articles.html?a=${$(this).data("id")}`});

//© Wiktor Golicz 2021 - WSZELKIE PRAWA ZASTRZEŻONE