var BaseBuild = Class.extend({
    init: function(data) {
        var self = this;
        if (data == null)
            data = {};

        ko.mapping.fromJS(data, {}, self);

        self.lowerStatus = ko.computed(function () {
            if(!this.status || this.status() == null)
                return 'unknown';
            return this.status().toLowerCase();
        }, self);

        self.isRunning = ko.computed(function () {
            return this.running && this.running();
        }, self);
    }
});
