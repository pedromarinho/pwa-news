'use strict';

var category = null;
var search = null;

var API = 'https://newsapi.org/v2/';
var ENDPOINT_HEADLINES = 'top-headlines?';
var ENDPOINT_EVERYTHING = 'everything?';
var API_KEY = 'apiKey=c5a59e6e745f45849e2e56af4efad07d';

$(document).ready(function () {
    $('.sidenav').sidenav();
})

getNews();

function getNews() {
    var url = API + ENDPOINT_HEADLINES + 'country=br&' + API_KEY + getCategory();
    $.get(url, success);
}

function getNewsWithSearch() {
    var url = API + ENDPOINT_EVERYTHING + API_KEY + getSearch();
    $.get(url, success);
}

function success(data) {
    var divNews = $('#news');
    divNews.empty();
    for (var i = 0; i < data.articles.length; ++i) {
        divNews.append(getNewsHtml(data.articles[i]));
    }
}

$(".headline").click(function () {
    category = null;
    activeMenu($(this));
});
$(".health").click(function () {
    category = 'health';
    activeMenu($(this));
});
$(".sports").click(function () {
    category = 'sports';
    activeMenu($(this));
});
$(".entertainment").click(function () {
    category = 'entertainment';
    activeMenu($(this));
});
$(".technology").click(function () {
    category = 'technology';
    activeMenu($(this));
});
$("#search").keypress(function (ev) {
    console.log('search')
    if (ev.which == 13) {
        search = $(this).val();
        if (search) {
            getNewsWithSearch();
        } else {
            getNews();
        }
    }
});

$("#nav-search-bt").click(function () {
    $("#search-bar").show();
    $("#top-bar").hide();
    $("#search-label").click();
});

$("#close-search-bt").click(function () {
    $("#search-bar").hide();
    $("#top-bar").show();
});

function activeMenu(menu) {
    search = null;
    $("#search").val('');
    getNews();
    $('html, body').animate({ scrollTop: 0 });
}

function getCategory() {
    if (category) {
        return '&category=' + category
    }
    return '';
}

function getSearch() {
    if (search) {
        return '&q=' + search
    }
    return '';
}

function getNewsHtml(article) {
    return $('<div>').addClass('col s12 m6 l12 xl6')
        .append(
            $('<div>').addClass('card')
                .append(
                    $('<div>').addClass('card-image')
                        .append(
                            $('<img>').attr('src', article.urlToImage ? article.urlToImage : 'images/placeholder-image.png')
                        ),
                    $('<div>').addClass('card-stacked')
                        .append(
                            $('<div>').addClass('card-content')
                                .append(
                                    $('<span>').append(moment(article.publishedAt).fromNow()),
                                    $('<span>').addClass('card-title').append(article.title),
                                    $('<p>').append(article.description)
                                ),
                            $('<div>').addClass('card-action')
                                .append(
                                    $('<a>').attr('href', article.url).append('Read article')
                                )
                        )

                )
        )
}

var deferredPrompt;
var btnInstall = $('#bt-install');

window.addEventListener('beforeinstallprompt', function (e) {
    console.log('beforeinstallprompt Event fired');
    e.preventDefault();

    btnInstall.show();

    M.toast({ html: 'Clique no botão de download para instalar a aplicação', classes: 'rounded' })

    deferredPrompt = e;

    return false;
});

btnInstall.click(function () {
    if (deferredPrompt !== undefined) {
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then(function (choiceResult) {

            console.log(choiceResult.outcome);

            if (choiceResult.outcome == 'accepted') {
                console.log('User added to home screen');
            } else {
                console.log('User cancelled home screen install');
            }

            deferredPrompt = null;
            btnInstall.hide();
        });
    }
});

