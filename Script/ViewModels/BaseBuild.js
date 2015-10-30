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
            return this.running && this.running() && this.percentageComplete;
        }, self);

        self.hasProgress = ko.computed(function () {
            if (this.percentageComplete)
                return true;
            else
                return false;
        }, self);

        self.hasBranchName = ko.computed(function() {
            if (this.branchName)
                return true;
            else
                return false;
        }, self);
    }
});
