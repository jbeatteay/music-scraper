var jsdom;
try {
  jsdom = require("jsdom/lib/old-api.js"); // jsdom >= 10.x
} catch (e) {
  jsdom = require("jsdom"); // jsdom <= 9.x
};
var request = require('https');
var fs = require("fs");
var Console = console.constructor;
var iframeSrc;
var targetUrl;


//TODO: Need to regex url and write an if statement to detect multiple arguments
var args = process.argv.slice(2);
var url = args[0];


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

function getPlayerData(elements) {


	elements.forEach( function (arrayItem){
		//console.log(arrayItem.artist)
		//console.log(arrayItem.title)
		//console.log(arrayItem.file['mp3-128'])


		var title = arrayItem.title;
		var fileUrl = arrayItem.file['mp3-128'];
		var tracknum = arrayItem.tracknum + 1;

		var parser = document.createElement('a');
		parser.href = fileUrl;
		console.log(parser.hostname + parser.pathname + parser.search)

		var options = {
		    host: parser.hostname,
		    path: parser.pathname + parser.search,
		    headers: {
		        Cookie: 'COOKIE=TEST',
		        Origin: 'http://bandcamp.com',
		        referer: 'https://bandcamp.com/EmbeddedPlayer.html/ref=http%253A%252F%252Fwww.topshelfrecords.com%252Fverse/album=529024372/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/tracklist=true/tracks=1819217714,1855758303,1486711082,40157989,2785178383,4152023906,1332687952,1675960477,1104903984,2263844213,1667168004/esig=5f2d506f99e44e0c9a65b0060f1fa743/rsig=6fe931562a092b7a3438be36c1348da5/'
		    },
		    encoding: null
		};

		var file = fs.createWriteStream(tracknum + "-" + title + ".mp3");

		request.get(options, (res) => {
		  console.log(`Got response: ${res.statusCode}`);

		  res.pipe(file);
		  // consume response body
		  res.resume();

		}).on('error', (e) => {
		  console.log(`Got error: ${e.message}`);
		});


	});
}

function getTargetUrl(element) {
	var isBandcampUrl = /^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?bandcamp\.com/.test(element);
	if(isBandcampUrl){

		targetUrl = iframeSrc.replace(/^https:\/\//i, 'http://');
		return targetUrl;
	}
}

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
					
				    	global.window = window;
	                	var $ = window.jQuery || window.$;
						document = window.document;

						if(typeof $ == 'undefined')
				        console.log('JQUERY NOT LOADED')
				      	else
				        console.log('JQUERY LOADED')

				    	var tracks = window.playerdata.tracks;

				    	//logfile("logs/log.txt");

	                	getPlayerData(tracks) 
	                	console.log('closed')
	                	window.close();
	                  
	        } 
	});

}

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

					if(typeof $ == 'undefined')
			        console.log('JQUERY NOT LOADED')
			      	else
			        console.log('JQUERY LOADED')

			    	iframeSrc = $('iframe').attr('src');


                	targetUrl = getTargetUrl(iframeSrc);
                	
                	runBCscrape(targetUrl);

                	console.log('closed')
                	window.close();

                  
        } 
});