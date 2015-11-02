var Sounds = {
    Failures: {
            CodeDefinedList: undefined, // See Content/sounds/!List.js

            // An extension point to have machine specific sounds.
            BrowserLocalList: Utils.getObservableArrayBackedByStorage(/*storage:*/ window.localStorage, /*storageKey:*/ getAppStorageKey('Sounds.Failures.BrowserLocalList')),

            List: ko.computed({ read: function () { return Sounds.Failures.CodeDefinedList.concat(Sounds.Failures.BrowserLocalList()) }, deferEvaluation: true }),

            getRandom: function() {
                return Sounds._getRandomSound(Sounds.Failures.List(), /*whereIsLocalIs:*/ false) || Sounds._getRandomSound(Sounds.Failures.List(), /*whereIsLocalIs:*/ true);
            },
            getRandomLocal: function() {
                return Sounds._getRandomSound(Sounds.Failures.List(), /*whereIsLocalIs:*/ true);
            },
    },

    _getRandomSound: function (list, whereIsLocalIs) {
        return _(list).chain()
            .map(Sounds._toSoundInfo)
            .filter(function(s) {
                return whereIsLocalIs === undefined || whereIsLocalIs === !isUrlAbsolute(s.url);
            })
            .sample().value();
    },
    _toSoundInfo: function toSoundInfo(soundPathOrSoundInfo) {
        return typeof soundPathOrSoundInfo === 'string' ?
        { url: isUrlAbsolute(soundPathOrSoundInfo) ? soundPathOrSoundInfo : 'Content/sounds/' + soundPathOrSoundInfo }
            :
            soundPathOrSoundInfo;
    }
};

function isUrlAbsolute(url) {
    // Source: http://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
    return /^https?:\/\//i.test(url);
}
