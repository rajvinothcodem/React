/**
 * Copyright © Chalhoub Group. All rights reserved.
 */

 define([
    'jquery',
    'LevelShoes_CmsStory/js/gtm-view-promotion',
    'LevelShoes_CmsStory/js/gtm-select-promotion',
    'underscore',
    'domReady!'
], function ($, gtmview, gtmselect , _) {
    'use strict';

    var myElement = document.getElementById("gtm-image");
    function checkViewSelect() {
        var viewElement = document.querySelectorAll(".view-select-event");
        if (myElement) {
            viewElement.forEach(element => {
                var attributes = $(element).data();    
                let options = {
                    dataLayer: {
                        creative_name:  attributes.creative_name,
                        creative_slot:  attributes.creative_slot,
                        location_id:    attributes.location_id,
                        promotion_id:   attributes.promotion_id,
                        promotion_name: attributes.promotion_name
                    }
                }
                var observer = new IntersectionObserver(function(entries) {
                    if(entries[0].isIntersecting === true)
                        console.log('Element has just become visible in screen');
                        var eve = options.dataLayer;
                        eve.event = "view_promotion"
                        if (_.where(window.dataLayer, eve).length == 0) {
                            gtmview(options, element);
                        }
                        
                        window.dataLayer = window.dataLayer || [];
                }, { threshold: [1] });
                
                observer.observe(element);
                gtmselect(options, element);
            });
        }
    }
    checkViewSelect();
});