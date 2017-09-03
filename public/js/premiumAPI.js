var wwo_api_js = function (){

        
        ﻿var _PremiumApiBaseURL = 'http://api.worldweatheronline.com/premium/v1/';
        /*
            Please change the PremiumAPIKey to your own. 
            These keys have been provided for testing only.
            If you don't have one, then register now: http://developer.worldweatheronline.com/member/register    
        */
        var _PremiumApiKey = 'w9ve379xdu8etugm7e2ftxd6';
        
        // -------------------------------------------
        
        function JSONP_LocalWeather(input) {
            var url = _PremiumApiBaseURL + 'weather.ashx?q=' + input.query + '&format=' + input.format + '&extra=' + input.extra + '&num_of_days=' + input.num_of_days + '&date=' + input.date + '&fx=' + input.fx + '&tp=' + input.tp + '&cc=' + input.cc + '&includelocation=' + input.includelocation + '&show_comments=' + input.show_comments + '&key=' + _PremiumApiKey;
        
            jsonP(url, input.callback);
        }
        
        function JSONP_SearchLocation(input) {
            var url = _PremiumApiBaseURL + "search.ashx?q=" + input.query + "&format=" + input.format + "&timezone=" + input.timezone + "&popular=" + input.popular + "&num_of_results=" + input.num_of_results + "&key=" + _PremiumApiKey;
        
            jsonP(url, input.callback);
        }
        
        function JSONP_TimeZone(input) {
            var url = _PremiumApiBaseURL + "tz.ashx?q=" + input.query + "&format=" + input.format + "&key=" + _PremiumApiKey;
        
            jsonP(url, input.callback);
        }
        
        function JSONP_MarineWeather(input) {
            var url = _PremiumApiBaseURL + "marine.ashx?q=" + input.query + "&format=" + input.format + "&fx=" + input.fx + "&key=" + _PremiumApiKey;
        
            jsonP(url, input.callback);
        }
        
        function JSONP_PastWeather(input) {
            var url = _PremiumApiBaseURL + 'past-weather.ashx?q=' + input.query + '&format=' + input.format + '&extra=' + input.extra + '&date=' + input.date + '&enddate=' + input.enddate + '&includelocation=' + input.includelocation + '&key=' + _PremiumApiKey;
        
            jsonP(url, input.callback);
        }
        
        // -------------------------------------------
        
        // Helper Method
        function jsonP(url, callback) {
            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                contentType: "application/json",
                jsonpCallback: callback,
                dataType: 'jsonp',
                success: function (json) {
                    console.dir('success');
                },
                error: function (e) {
                    console.log(e.message);
                }
            });
        }


};

var wwo_api = new wwo_api_js(); 