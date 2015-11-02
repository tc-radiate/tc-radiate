ko.bindingHandlers.afterHtmlRender = {
    /// A remedy for knockout not firing script tags in templates, and the unaddressed issue of not having afterRender for if: https://github.com/knockout/knockout/issues/421
    /// Use examples:
    /// <![CDATA[
    /// expression:
    /// <span data-bind="afterHtmlRender: some().expression()"></span>
    /// function:
    /// <span data-bind="afterHtmlRender: function (element) { /*do something with the bound element*/ }"></span>
    /// ko virtual element:
    /// <!-- ko afterHtmlRender: function (virtualElements) { /*do something with the bound element*/ } --><!-- /ko -->
    /// ]]>
    init: function (elementOrKoVirtualElements, valueAccessor, allBindings, viewModel, bindingContext) {

        ko.applyBindingsToDescendants(bindingContext, elementOrKoVirtualElements);

        var value = valueAccessor();
        if (_.isFunction(value)) {
            var resultOrFunction = value(elementOrKoVirtualElements);
            if (_.isFunction(resultOrFunction))
                resultOrFunction(elementOrKoVirtualElements);
        }

        // Tell KO *not* to bind the descendants itself, because we've already done it
        return { controlsDescendantBindings: true };

    }
}
ko.virtualElements.allowedBindings.afterHtmlRender = true;