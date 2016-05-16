'use strict';
// package for running reguests parallel
var async = require("async");
// package for retry request in case of failure
var request = require('requestretry');
// maximum number of attempts in case of failure
// and retry delay between attempts
// and how to deal with request error
const defaulConfig_ = {
    maxAttempts: 10,
    retryDelay: 500,
    retryStrategy: desiredStrategy
}

var DataFetch = class DataFetch {
    // constructor
    constructor(urls_) {
        // field hold text to analyze
        if (Object.prototype.toString.call(urls_) != '[object Array]') {
            this.URLs = [urls_];
        }
        else {
            this.URLs = urls_;
        }
        // configurations
        this.Config = defaulConfig_;
        this.Data = '';
    }

    // configurations setter for retry strategy
    setConfigurations(config_) {
        try {
            for (var key in config_) {
                if (this.Config.hasOwnProperty(key)) {
                    this.Config[key] = config_[key];
                }
            }
        }
        catch (ex) {
            console.log('Invalid congigurations');
        }
    }

    // after instantiation the object
    startFetch(callback) {
        // hold the object in temporar variable
        var thisObj = this;
        // run the data-fetch function for each url parallel
        async.each(thisObj.URLs,
            // fetch the text-file from URL
            function (url_, cb_) {
                // request configurations
                var reqConfig = {
                    method: 'GET',
                    url: url_.toString(),
                    // configurations for retry
                    maxAttempts: thisObj.getConfig().maxAttempts,
                    retryDelay: thisObj.getConfig().retryDelay,
                    retryStrategy: thisObj.getConfig().retryStrategy,
                    // content type
                    headers: {
                        'content-type': 'text/plain'
                    }
                };
                // fetch data from url
                request(reqConfig, function (err, res, dat) {
                    if (!err && res.statusCode >= 200 && res.statusCode < 300) {
                        // append the fetched data to the data-fetch object
                        thisObj.appendData(dat);
                        console.log('Data fetched from ', url_);
                        // call the processing data moderator
                        cb_();
                    }
                    else {
                        console.log('Failed to fetch data from ', url_);
                        console.log('Exiting application!');
                        // exiting application in case of error
                        process.exit(-1);
                    }
                });
            },
            // after getting all files, call callback fun to handle data
            function (err) {
                if (!err) {
                    // call the collected data-handler 
                    callback(thisObj.getData());
                }
                else {
                    callback(null);
                }
            });
    }

    // configurations getter
    getConfig() {
        return this.Config;
    }

    // combined data getter
    getData() {
        return this.Data;
    }

    // append fetched data to the data-fetch object
    appendData(dat) {
        this.Data += dat;
    }
}

module.exports = DataFetch;

// the desired strategy of dealing with errors to retry requet
function desiredStrategy(err, res) {
    return res && 400 <= res.statusCode && res.statusCode < 600;
}