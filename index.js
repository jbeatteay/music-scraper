var jsdom;
try {
  jsdom = require("jsdom/lib/old-api.js"); // jsdom >= 10.x
} catch (e) {
  jsdom = require("jsdom"); // jsdom <= 9.x
};
var request = require('https');
var fs = require("fs");
var url = require('url');
var Q = require('q');
var Console = console.constructor;
var iframeSrc;
var targetUrl;


//TODO: Need to regex url and write an if statement to detect multiple arguments
var args = process.argv.slice(2);
var url = args[0];


var logsDir = __dirname + '/logs';
var mediaDir = __dirname + '/media';

// redirect global console object to log file
function logfile(file) {
    var con = new Console(fs.createWriteStream(file));
    Object.keys(Console.prototype).forEach(name => {
        console[name] = function() {
            con[name].apply(con, arguments);
        };
    });
}

module.exports = logfile;

//save the music, took this function from the interet. This will help if the URL is redirected.
function download(uri, filename) {

    var protocol = "https";
    var deferred = Q.defer();
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

//get the music data
function getPlayerData(elements) {

	if (!fs.existsSync(mediaDir)) {
	    fs.mkdirSync(mediaDir, 0744);
	}

	elements.forEach( function (arrayItem){

		var tracknum = arrayItem.tracknum + 1;
		var title = arrayItem.title;
		var fileUrl = arrayItem.file['mp3-128'];
		

		//Easy way to get hostname, pathname and url params!
		var parser = document.createElement('a');
		parser.href = fileUrl;
		console.log(parser.hostname + parser.pathname + parser.search)


		var options = {
		    host: parser.hostname,
		    path: parser.pathname + parser.search,
		    headers: {
		        Cookie: 'COOKIE=TEST',
		        Origin: 'http://bandcamp.com',
		        //TODO: Need to dynamically populate referer once I find new embeds
		        referer: 'https://bandcamp.com/EmbeddedPlayer.html/ref=http%253A%252F%252Fwww.topshelfrecords.com%252Fverse/album=529024372/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/tracklist=true/tracks=1819217714,1855758303,1486711082,40157989,2785178383,4152023906,1332687952,1675960477,1104903984,2263844213,1667168004/esig=5f2d506f99e44e0c9a65b0060f1fa743/rsig=6fe931562a092b7a3438be36c1348da5/'
		    },
		    encoding: null
		};


		var file = "media/" + tracknum + "-" + title + ".mp3";

		
		download(options, file);
	});
}

function getTargetUrl(element) {
	var isBandcampUrl = /^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?bandcamp\.com/.test(element);
	if(isBandcampUrl){

		targetUrl = iframeSrc.replace(/^https:\/\//i, 'http://');
		return targetUrl;
	}
}

//bandcamp iframe scrape
function runBCscrape(u){

	jsdom.env({
	        url: u,
			referer: 'http://bandcamp.com/EmbeddedPlayer.html/ref=http%253A%252F%252Fwww.topshelfrecords.com%252Fverse/album=529024372/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/tracklist=true/tracks=1819217714,1855758303,1486711082,40157989,2785178383,4152023906,1332687952,1675960477,1104903984,2263844213,1667168004/esig=5f2d506f99e44e0c9a65b0060f1fa743/rsig=6fe931562a092b7a3438be36c1348da5/',
	        scripts: ["http://code.jquery.com/jquery-latest.min.js"],
	        features:{
		      FetchExternalResources: ["script"],
		      ProcessExternalResources: ["script"],
		      MutationEvents: '2.0'
		    },
		    onload: function(err, window) {
		      console.log('*******onload')
		    },
		    created: function(err, window) {
		      console.log('*******created')
		    }, 
	        done: function(err, window){
	        		console.log('*******done')
					if(err){
				        console.log('*****got err ' + err.message);
				        callback(err);
				      }
					
					if (!fs.existsSync(logsDir)) {
						    fs.mkdirSync(logsDir, 0744);
						}



				    	global.window = window;
	                	var $ = window.jQuery || window.$;
						document = window.document;

						/*
						if(typeof $ == 'undefined')
				        console.log('JQUERY NOT LOADED')
				      	else
				        console.log('JQUERY LOADED')
						*/

				    	var tracks = window.playerdata.tracks;

				    	
						logfile("logs/log.txt");

	                	getPlayerData(tracks) 

	                	console.log('closed')
	                	window.close();
	                  
	        } 
	});

}


//iniate first scrape
jsdom.env({
        url: url,
        scripts: ["http://code.jquery.com/jquery-latest.min.js"],
        referer: 'http://bandcamp.com/EmbeddedPlayer.html/ref=http%253A%252F%252Fwww.topshelfrecords.com%252Fverse/album=529024372/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/tracklist=true/tracks=1819217714,1855758303,1486711082,40157989,2785178383,4152023906,1332687952,1675960477,1104903984,2263844213,1667168004/esig=5f2d506f99e44e0c9a65b0060f1fa743/rsig=6fe931562a092b7a3438be36c1348da5/',
	    onload: function(err, window) {
	      console.log('*******onload')
	    },
	    created: function(err, window) {
	      console.log('*******created')
	    }, 
        done: function(err, window){
        		console.log('*******done')
				if(err){
			        console.log('*****got err ' + err.message);
			        callback(err);
			      }
				
			    	global.window = window;
                	var $ = window.jQuery || window.$;
					document = window.document;

					/*
					if(typeof $ == 'undefined')
			        console.log('JQUERY NOT LOADED')
			      	else
			        console.log('JQUERY LOADED')
					*/

			    	iframeSrc = $('iframe').attr('src');


                	targetUrl = getTargetUrl(iframeSrc);
                	
                	runBCscrape(targetUrl);

                	console.log('closed')
                	window.close();

                  
        } 
});