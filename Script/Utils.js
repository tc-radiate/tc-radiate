//----------------------
// HELPER METHODS
//----------------------
var Utils = {

    //Returns one of 11 random images for the buid success or fail image
    getRandomClass : function() {
        return 'c' + Math.floor(Math.random() * 11);
    },

    //Used to append a timestamp to the url so the result isn't cached
    getTsQSParam : function() {
        return "&ts=" + new Date().toTimeString();
    }
};

//----------------------
// KNOCKOUTJS EXTENSIONS
//----------------------

//Animate the showing and hiding of a bound element
ko.bindingHandlers.showHide = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        $(element).toggle(ko.utils.unwrapObservable(value));
    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? $(element).fadeIn(500) : $(element).fadeOut(300);
    }
};

//Provides a way of accessing properties without them being null
ko.safeObservable = function (initialValue) {
    var result = ko.observable(initialValue);
    result.safe = ko.dependentObservable(function () {
        return result() || {};
    });
    return result;
};