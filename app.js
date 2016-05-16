// package for running reguests parallel
var DataFetch = require("./data-fetch.js");
// class for analyzing the text to find the top N words
var TextAnalyzer = require('./text-analyse.js');
// list of URLs of files
var urls = [
	'http://textfiles.com/humor/calculus.txt',
	'http://textfiles.com/humor/college.txt',
	'http://textfiles.com/humor/drinker.txt',
	'http://www.cl.cam.ac.uk/~mgk25/ucs/examples/UTF-8-test.txt',
	'http://www.ssec.wisc.edu/~billh/README.text'
];
// an instance of data-fetcher class
var dataFetch = new DataFetch(urls);

// set the configurations of retry-attempts
dataFetch.setConfigurations({
    maxAttempts: 10,
    retryDelay: 100
});

// start request data from URLs
// and pass the results to the data-processing function
dataFetch.startFetch(processData);

// process the fetched data
function processData(data) {
    if (!data) {
        console.log("There is no text to handle, Sorry!");
        return;
    }
    // an instance of text-analyzer class
    var ta = new TextAnalyzer(data);
    // set configurations to the data-fetcher, 
    // how to deal with thenon - words and common words
    ta.setConfigurations({
        // the number of top words wanted
        topWordsCount: 10,
        // strategy of dealing with common words
        excludeCommonWords: true,
        // strategy of dealing with numbers
        excludeNumbers: false,
        // strategy of dealing with words have the same number of occurencess
        fairStrategy: true
    });
    // hold the results of top-10-words
    var result_ = ta.getTopNWords();
    // showing the data
    // header
    console.log("Here you find the most used word:");
    console.log('________________________________');
    console.log(' Ocuurences\t| Word');
    console.log('----------------+---------------');
    // data show
    for (var i in result_) {
        console.log(' ' + result_[i].count + '\t\t| ' + result_[i].word);
    }
    // footer
    console.log('________________|_______________');
}
