/*
* @Author: gbk
* @Date:   2016-03-28 16:42:29
* @Last Modified by:   gbk
* @Last Modified time: 2016-03-28 18:02:37
*/

'use strict';

var parseUrl = require('parseurl');
var resolve = require('path').resolve;
var send = require('send');

module.exports = function(root, opts) {
    opts = opts || {};
    opts.root = resolve(root);

    return function(req, res, next) {
        var forwardError = false;
        send(req, parseUrl(req).pathname, opts)
            .on('directory', onDirectory)
            .on('file', function() {
                forwardError = true;
            })
            .on('error', function(err) {
                if (forwardError || !(err.statusCode < 500)) {
                    next(err);
                    return;
                }
                next();
            })
            .pipe(res);
    };

    function onDirectory() {
        this.error(404);
    }
};