//----------------------
// HELPER METHODS
//----------------------
var Utils = {

    isUrlAbsolute: function (url) {
        // Source: http://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
        return /^https?:\/\//i.test(url);
    },

    //Used to append a timestamp to the url so the result isn't cached
    getTsQSParam : function() {
        return "&ts=" + new Date().toTimeString();
    },
    // So that you can 'Push' to it.
    getObservableArrayBackedByStorage: function (storage, storageKey) {
        var observableArray = ko.observableArray();

        var objectStorageObservable = Utils.getObservableBackedByStorage(/*storage:*/ storage, /*storageKey:*/ storageKey, /*initialValue:*/[]);

        observableArray(objectStorageObservable());

        observableArray.subscribe(function(newValue) {
            objectStorageObservable(newValue);
        });

        return observableArray;
    },
    getObservableBackedByStorage: function (storage, storageKey, initialValue) {
        var objectSerializedToStringChangeTrigger = ko.observable();

        var objectSerializedToString = ko.computed({
            read: function () {
                var value = storage.getItem(storageKey);
                objectSerializedToStringChangeTrigger();
                return value;
            },
            write: function (value) {
                if (!value)
                    storage.removeItem(storageKey);
                else
                    storage.setItem(storageKey, value);
                objectSerializedToStringChangeTrigger(value);
            }
        });

        var theObservable = ko.computed({
            read: function () {
                return JSON.parse(objectSerializedToString());
            },
            write: function (value) {
                return objectSerializedToString(JSON.stringify(value));
            }
        });
        if (localStorage.getItem(storageKey) === null)
            theObservable(initialValue);

        return theObservable;
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