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
                return whereIsLocalIs === undefined || whereIsLocalIs === !Utils.isUrlAbsolute(s.url);
            })
            .sample().value();
    },
    _toSoundInfo: function (soundPathOrSoundInfo) {
        return typeof soundPathOrSoundInfo === 'string' ?
        { url: Utils.isUrlAbsolute(soundPathOrSoundInfo) ? soundPathOrSoundInfo : 'Content/sounds/' + soundPathOrSoundInfo }
            :
            soundPathOrSoundInfo;
    }
};
