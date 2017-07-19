/*
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();

JSDOM.fromURL('https://bandcamp.com/EmbeddedPlayer.html/ref=https%253A%252F%252Fbandcamp.com%252FEmbeddedPlayer.html%252Fref%253Dhttp%2525253A%2525252F%2525252Fwww.topshelfrecords.com%2525252Fverse%252Falbum%253D529024372%252Fsize%253Dlarge%252Fbgcol%253Dffffff%252Flinkcol%253D0687f5%252Fartwork%253Dsmall%252Ftransparent%253Dtrue%252Ftracklist%253Dtrue%252Ftracks%253D1819217714%252C1855758303%252C1486711082%252C40157989%252C2785178383%252C4152023906%252C1332687952%252C1675960477%252C1104903984%252C2263844213%252C1667168004%252Fesig%253D5f2d506f99e44e0c9a65b0060f1fa743%252Frsig%253D6fe931562a092b7a3438be36c1348da5%252F/album=529024372/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/tracklist=true/tracks=1819217714,1855758303,1486711082,40157989,2785178383,4152023906,1332687952,1675960477,1104903984,2263844213,1667168004/esig=5f2d506f99e44e0c9a65b0060f1fa743/rsig=e4fdde91f82622f61e150869d031ade1/', {
  script: [
    'http://code.jquery.com/jquery-1.5.min.js'
  ],
  referrer: 'https://bandcamp.com/EmbeddedPlayer.html/ref=http%253A%252F%252Fwww.topshelfrecords.com%252Fverse/album=529024372/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/tracklist=true/tracks=1819217714,1855758303,1486711082,40157989,2785178383,4152023906,1332687952,1675960477,1104903984,2263844213,1667168004/esig=5f2d506f99e44e0c9a65b0060f1fa743/rsig=6fe931562a092b7a3438be36c1348da5/',
  userAgent: "Mellblomenator/9000",
  includeNodeLocations: true,
}).then(dom => {
	const domStr = dom.serialize()
	const re = /(.*playerdata\n=\n\s+)(.*)(\s+"script".*)/;
	const newtext = domStr.replace(re, "$2");

  	console.log(newtext);
});
*/
/*
var request = require('https');
var scraperjs = require('scraperjs');
var fs = require('fs');

var options = {
    host: 'popplers5.bandcamp.com',
    path: '/download/track?enc=mp3-128&fsig=f9474467992e1ad27a3bb256025e03f5&id=1819217714&stream=1&ts=1500417007.0',
    headers: {
        Cookie: 'COOKIE=TEST',
        Origin: 'http://bandcamp.com',
        referer: 'https://bandcamp.com/EmbeddedPlayer.html/ref=http%253A%252F%252Fwww.topshelfrecords.com%252Fverse/album=529024372/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/tracklist=true/tracks=1819217714,1855758303,1486711082,40157989,2785178383,4152023906,1332687952,1675960477,1104903984,2263844213,1667168004/esig=5f2d506f99e44e0c9a65b0060f1fa743/rsig=6fe931562a092b7a3438be36c1348da5/'
    },
    encoding: null
};

var file = fs.createWriteStream("file.mp3");

request.get(options, (res) => {
  console.log(`Got response: ${res.statusCode}`);

  res.pipe(file);
  // consume response body
  res.resume();

}).on('error', (e) => {
  console.log(`Got error: ${e.message}`);
});
*/
/*
scraperjs.StaticScraper.create('https://bandcamp.com/EmbeddedPlayer/album=529024372/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/tracklist=true/tracks=1819217714,1855758303,1486711082,40157989,2785178383,4152023906,1332687952,1675960477,1104903984,2263844213,1667168004/esig=5f2d506f99e44e0c9a65b0060f1fa743/')
    .scrape(function($) {
        console.log($('#artarea').children().eq(0).attr('href'))
    })
    .then(function() {
        console.log('then?');
    })
*/

