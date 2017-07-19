var fs = require('fs');
var url = require('url');
var Q = require('q');

function download(uri, filename) {

    var protocol = url.parse(uri).protocol.slice(0, -1);
    var deferred = Q.defer();
    console.log(protocol);
    var onError = function (e) {
        fs.unlink(filename);
        deferred.reject(e);
    }
    require(protocol).get(uri, function(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
            var fileStream = fs.createWriteStream(filename);
            fileStream.on('error', onError);
            fileStream.on('close', deferred.resolve);
            response.pipe(fileStream);
        } else if (response.headers.location) {
            deferred.resolve(download(response.headers.location, filename));
        } else {
            deferred.reject(new Error(response.statusCode + ' ' + response.statusMessage));
        }
    }).on('error', onError);
    return deferred.promise;
};

download("https://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=567ee3cd8dce211b64b63fe44d5c095c&id=1819217714&stream=1&ts=1500491512.0", "test.mp3");

