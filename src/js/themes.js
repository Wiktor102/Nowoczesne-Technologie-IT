const changeTheme = (save = false) => {
    if (easterEggActive) return;

    $('body').toggleClass("dark");
    $('.theme_change > i').toggleClass("fa-moon");
    $('.theme_change > i').toggleClass("fa-sun");

    if (currMode == "light") {
        currMode = "dark";
    } else if (currMode == "dark" && save) {
        currMode = "light"
    }

    if (save) saveTheme();
}
const saveTheme = () => {localStorage.setItem("theme", currMode);};
const getSavedTheme = () => {return localStorage.getItem("theme");};

//pobranie zapisanego trybu z pamięci lokalnej i zastosowanie go
let currMode = getSavedTheme() || "light";
if (currMode != "light") changeTheme();

//Zmiana trybu za pomocą przycisku
$('.theme_change').click(() => {changeTheme(true)});

//Jeśli użytkownik preferuje tryb ciemny, ten załącza się automatycznie
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
if (mediaQuery.matches) changeTheme(true);


//blokada przewijania strony kiedy otwarte jest meni nawigacji na urządzeniach mobilnych (< 600px)
$(window).scroll(() => {
    if ($('#nav__checkbox').is(":checked")) {
        window.scroll(0, 0);
    }
});

//easter egg
let changeAmmount = 0;
let resetSet = false;
let easterEggActive = false;
$('.theme_change').click(() => {
    changeAmmount++;

    if (changeAmmount == 5) {
        $('.theme_change > i').removeClass().addClass(["fas", "fa-egg"]);
        easterEggActive = true;

        setTimeout(() => {
            window.open("https://wiktorgolicz.pl", "_blank");
            easterEggActive = false;
            changeAmmount = 0;
            $('.theme_change > i').removeClass();

            if (currMode == "light") {
                $('.theme_change > i').removeClass().addClass(["fas", "fa-moon"]);
            } else {
                $('.theme_change > i').removeClass().addClass(["fas", "fa-sun"]);
            }

        }, 2500);
    }

    if (!resetSet) {
        resetSet = true;
        setTimeout(() => {changeAmmount = 0}, 800);
    }
});

//© Wiktor Golicz 2021 - WSZELKIE PRAWA ZASTRZEŻONE