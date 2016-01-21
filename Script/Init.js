$(document).ready(function () {

    //bind the knockoutjs model to the html
    var viewModel = new BuildScreenViewModel();
    ko.applyBindings(viewModel);

    //hook up error handling here to avoid the DOM dependency on the view model
    $(document).ajaxError(function (event, request, settings, error) {
        console.error({ message: 'Received error for ajax request ' + settings.url, arguments: arguments });
    });

    $(document).ajaxSuccess(function () {
        viewModel.hasConnectionWorked(true);
    });
});

$(document).ajaxSuccess(function () {

    //Update the progress bars after new ajax data is requested
    $('.progress-container').each(function (index, obj) {
        if ($(obj).is(":data( 'ui-progressbar' )"))
            $(obj).progressbar("value", parseInt($(obj).attr("data-progress")));
        else
            $(obj).progressbar({ value: parseInt($(obj).attr("data-progress")) });

    });
});
