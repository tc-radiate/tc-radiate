var UrlParams = {};
(function () {
    var match,
    pl= /\+/g,
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    query  = window.location.search.substring(1);

    while (match = search.exec(query))
    UrlParams[decode(match[1])] = decode(match[2]);
})();