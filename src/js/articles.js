import 'regenerator-runtime/runtime'; //Trzeba to zaimportować żeby async/await działało w starszych przeglądarkach
import {get_comments_html} from './comments';
import {setUrlParam, getUrlParam} from './urlParmas';
import getArticleContentHtml from './getArticlesHtml';

//funkcje ładujące listę artykułów
const get_articles_list = () => {
    return new Promise((resolve, reject) => {
        $.ajax({url: "get_articles.php", dataType: "JSON"})
        .done((data) => resolve(data))
        .fail((err) => reject(err));
    });
}

const display_articles_list = async () => {

    try {
        const articles_list = await get_articles_list();

        articles_list.forEach((v, i, a) => {
            v.data = JSON.parse(v.data);
            const {id, data: [title, img, text]} = v;

            $('.articles__list').append(`
                <section class="article" data-id="${id}">
                    <div>
                        <h2>${title}</h2>
                        <p class="article__text_preview">${text}</p>
                    </div>
                    <img src="${img}" alt="obrazek :-("/>
                </section>
            `);
        });

    } catch (err) {
        console.error(err);
    }

}


//funkcje ładujące i pokazujące artykuł
const show_article = async (id) => {

    if (id == "undefined" || id == 0) {return;}

    const article = is_loaded(id);

    if (article) {
        $('#main').hide();
        $(article).show();
        window.scroll(0, 0);
        return;
    }

    try {
        const {msg, id: article_id, date, data,} = await get_article(id);

        if (msg) {
            throw new Error(msg);
        }

        const {showTitleImgSource = false, ...article} = JSON.parse(data);

        const html = `
        <article data-id="${article_id}">
            <div class="back to_articles"><i class="fas fa-arrow-left"></i></div>
            <h1>${article.title}</h1>
            <div class="date">${date}</div>
            <hr/>
            <div data-showSource="${showTitleImgSource}" data-ImgSource="${new URL(article.titleImgPath).host}" class="image image--title">
                <img src="${article.titleImgPath}" alt="${article.title}"/>
            </div>

            <div>${getArticleContentHtml(article)}</div>

            <h3 class="comments__header">
                <span>Komentarze</span>
            </h3>
            <section class="comments" data-id="${article_id}">
                <span class="back to_comments"  style="display: none;"><i class="fas fa-arrow-left"></i></span>
                <button class="comments__add_comment"><i class="fas fa-plus"></i> Dodaj komentarz</button>

                <div class="comments__container">${await get_comments_html(article_id)}</div>

                <div class="form" style="display: none;">
                    <label title="Ta nazwa będzie widoczna dla wszystkich użytkowników">Nazwa użytkownika <input type="text" class="comment__username" autocomplete="off"/></label>
                    <label>Komentarz <textarea class="comment__text"></textarea></label>
                    <button class="comment__publish"><i class="fas fa-plus"></i> Opublikuj komentarz</button>
                </div>
            </section>

        </article>`;

        $(html).prependTo('#articles_container').data("id", article_id);
        $('#main').hide();
        window.scroll(0, 0);

        if (getUrlParam("a") != article_id) {
            setUrlParam("a", article_id);
        }

    } catch (err) {
        console.error(err);
    }
}

const is_loaded = id => {
    let article = null;

    $('#articles_container > article').each(function () {
        if ($(this).data("id") == id) {
            article = this;
            return false;
        }
    });

    return article;
}

const get_article = (id) => {
    return new Promise((resolve, reject) => {
        $.post({url: "get_article.php", dataType: "JSON", data: {id: id}})
        .done((data) => {resolve(data);})
        .fail((err) => {reject(err);});
    });
}

$('body').on("click", '.articles__list > .article', function () {show_article($(this).data("id"))});
$('body').on("click", 'article .back.to_articles', function () {$('#articles_container > article').hide(); $('#main').show(); setUrlParam("a", 0)});
$('body').on("click", 'article .redirect', function () {show_article($(this).data("articleid"));});

//Przycisk przewijający stronę do góry
$('.to_top').click(() => {window.scroll(0, 0);});
$(window).scroll(() => {

    if ($('#nav__checkbox').is(":checked")) {$('.to_top').css("opacity", 0); return;}
    if (window.scrollY >= 220) {
        $('.to_top').css("opacity", 1);
    } else {
        $('.to_top').css("opacity", 0);
    }
});

display_articles_list();
show_article(getUrlParam("a"));

//© Wiktor Golicz 2021 - WSZELKIE PRAWA ZASTRZEŻONE