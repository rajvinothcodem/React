/*
 * Copyright (c) 2023. Recodem, Inc. All rights reserved.
 *
 */

define([
    'jquery',
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'ko'
], function ($, Component, customerData, ko) {
    'use strict';
    return Component.extend({
        /** @inheritdoc */
        cartUrl: ko.observable(''),
        initialize: function () {
            this._super();
            self = this;
            self.getCartUrl();
            ko.computed(function() {
                return customerData.get('cart')();
            }).subscribe(function (){
                self.getCartUrl();
            })
        },
        getCartUrl: function ()
        {
            let thisdata = this;
            let cartData = customerData.get('cart')();
            let quote = cartData.quote_id;
            let storeCode = cartData.store_code;
            let url = `http://localhost:3000/cart/${storeCode}/${quote}`;
            thisdata.cartUrl(url);
        }
    });
});
