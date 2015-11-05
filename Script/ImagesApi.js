var Images = {
    failure: {
            CodeDefinedList: undefined, // See Content/images/!List.js

            // An extension point to have machine specific images.
            BrowserLocalList: Utils.getObservableArrayBackedByStorage(/*storage:*/ window.localStorage, /*storageKey:*/ getAppStorageKey('Images.failure.BrowserLocalList')),

            List: ko.computed({ read: function () { return Images.failure.CodeDefinedList.concat(Images.failure.BrowserLocalList()) }, deferEvaluation: true }),

            getRandom: function() {
                return Images._getRandom(Images.failure.List());
            },
    },
    success: {
        CodeDefinedList: undefined, // See Content/images/!List.js

        // An extension point to have machine specific images.
        BrowserLocalList: Utils.getObservableArrayBackedByStorage(/*storage:*/ window.localStorage, /*storageKey:*/ getAppStorageKey('Images.success.BrowserLocalList')),

        List: ko.computed({ read: function () { return Images.success.CodeDefinedList.concat(Images.success.BrowserLocalList()) }, deferEvaluation: true }),

        getRandom: function () {
            return Images._getRandom(Images.success.List());
        },
    },

    unknown: {
        CodeDefinedList: undefined, // See Content/images/!List.js

        // An extension point to have machine specific images.
        BrowserLocalList: Utils.getObservableArrayBackedByStorage(/*storage:*/ window.localStorage, /*storageKey:*/ getAppStorageKey('Images.unknown.BrowserLocalList')),

        List: ko.computed({ read: function () { return Images.unknown.CodeDefinedList.concat(Images.unknown.BrowserLocalList()) }, deferEvaluation: true }),

        getRandom: function () {
            return Images._getRandom(Images.unknown.List());
        },
    },

    _getRandom: function (list) {
        return _(list).chain().map(Images._getEnsuredUrlIsAbsolute)
            .sample().value();
    },

    _getEnsuredUrlIsAbsolute: function (imagePathOrUrl) {
        return Utils.isUrlAbsolute(imagePathOrUrl) ? imagePathOrUrl : ('Content/images/' + imagePathOrUrl);
    }
};

