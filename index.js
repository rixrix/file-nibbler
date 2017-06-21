'use strict';

var async = require('async');
var fs = require('fs');
var path = require('path');

/**
 * @constant {number} - Default queue concurrency level
 */
var DEFAULT_CONCURRENCY_LEVEL = 5;

/**
 * @constant {string} - Default file filter, matches all files w/ extensions. credits: https://stackoverflow.com/a/34773221
 */
var DEFAULT_FILE_FILTER = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi;

/**
 * Returns an array of files from the specified directory.
 * It will always return in full path;
 *
 * Directory is parsed synchronously.
 *
 * @param {string} pathToDir
 * @param {string} filterBy
 * @returns {Object[]} files
 */
function getFiles(pathToDir, filterBy) {
    return fs.readdirSync(pathToDir)
    .filter(function(file) {
        return file.match(filterBy);
    })
    .map(function(file) {
        return path.join(pathToDir, file);
    });
}

/**
 * Takes care of munching your files in a manner that you won't hit the "Open Files" limit of your operating system.
 * We'll make use of async.js functionality called `queue`. See README for more details
 *
 * @param {string} pathToDir - Path to the files folder
 * @param {requestCallback} callback - A user-defined function that gets called in the queue. It will receive the value of the array that's being processed in the queue, in this case the filename
 * @param {Object[]} option - optional parameters
 * @param {string} option[].filterBy - A regex-based flag for filtering out uneeded files otherwise returns all the files.
 * @param {number} option[].concurrencyLevel - Sets the queue concurrency level when processing files
 * @returns {Object} promise - returns a Promise
 */
exports.nibbler = function(pathToDir, callback, option) {
    var _option = option || {};

    _option.concurrencyLevel = _option.concurrencyLevel || DEFAULT_CONCURRENCY_LEVEL;
    _option.filterBy = _option.filterBy
        ? new RegExp(_option.filterBy, "i")
        : DEFAULT_FILE_FILTER;

    return new Promise(function(resolve, reject) {
        var queue = async.queue(function(task, next) {

            // @NOTE: call user function.
            //        I have a feeling that this will crap out at some point eg. when the callback is async,
            //        right now my use-case is sync-mode. FYI
            callback(task.name);

            //@NOTE https://github.com/caolan/async/issues/1266#issuecomment-267103051
            async.setImmediate(next, null);
        }, _option.concurrencyLevel);

        // batch process the files by dropping it into an array
        queue.push(getFiles(pathToDir, _option.filterBy).map(function(file) {
            return {
                name: file
            };
        }), function(error) {
            if (error) console.log('There was an error processing the files:', error);
        });

        // once we're done, resolve the promise
        queue.drain = function() {
            resolve();
        };

        queue.error = function(error, task) {
            reject({
                error: error,
                task: task
            });
        };
    });
};
