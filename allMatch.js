let cheerio = require("cheerio");
let fs = require("fs");
let request = require("request");
//require the exported function from match.js.
let matchFile = require("./match.js");
//url of a single match in  fixtures and results.
let url = "https://www.espncricinfo.com/scores/series/8039/season/2015/icc-cricket-world-cup?view=results";

//All Match Handler function will be called by main.js file for results.
//and a url will be passed.
function allMatchHandler(url) {

    request(url, cb);
}
function cb(err, header, body) {
    // request is successfully processed
    if (err == null && header.statusCode == 200) {
        console.log("recieved Response");
        // console.log("Html recieved");
        parseHtml(body);
        // fs=> file system
        // fs.writeFileSync("page.html", body);
    } else if (header.statusCode == 404) {
        console.log("Page Not found");
    } else {
        console.log(err);
        console.log(header);
    }
}
function parseHtml(body) {
    let $ = cheerio.load(body);
    // .match-cta-container a
    let allMatches = $(".col-md-8.col-16");
    // console.log(allMatches.length);
    for (let i = 0; i < allMatches.length; i++) {
        let allAnchors = $(allMatches[i]).find(".match-cta-container a");
        let scorecardA = allAnchors[0]; //anchor of scorescard.
        let link = $(scorecardA).attr("href");
        let cLInk = "https://www.espncricinfo.com/" + link;
        //for each match in results and fixtures,
        //matchHandler function of match.js will be invoked and the details of the players will be maintained in a xlsx file.
        matchFile.matchHandler(cLInk);

    }
}
module.exports.allMatchHandler = allMatchHandler;