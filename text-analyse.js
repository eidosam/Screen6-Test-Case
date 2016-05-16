'use strict';
// words excluded from statistics
const excludedWords_ = 'a an the this that those with if as' +
' in on of off or and to for' +
' i he she it they we you' +
' her him yours their its his your' +
' is be am was were are';
// default settings for dealing with words
const defaulConfig = {
    // the number of top words wanted
    topWordsCount: 10,
    // strategy of dealing with common words
    excludeCommonWords: true,
    // strategy of dealing with numbers
    excludeNumbers: true,
    // strategy of dealing with words have the same number of occurencess
    fairStrategy: true,
    // words excluded from statistics
    excludedWords: excludedWords_
}

var TextAnalyzer = class TextAnalyzer {
    // constructor
    constructor(text_) {
        // field hold text to analyze
        this.Text = text_;
        // configurations
        this.Config = defaulConfig;
    }

    // config setter
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

    // add extra words to be excluded
    appendToExcludedWords(str) {
        this.Config.excludedWords += str;
    }

    // get the top-n-words
    getTopNWords() {
        var text = this.Text.toString();
        this.Config.excludedWords = this.Config.excludedWords.toLowerCase();
        // in case of numbers are not included in comparision
        // remove them
        if (this.Config.excludeNumbers)
            text = text.replace(/\d+/gi, '');
        // convert to lowercase to ignore difference in letter-case
        // replace non alphanumeric characters with nothing
        // eliminate the white-spaces at boundaries
        // split the text to words according to spaces, whatever the number of them.
        // sort the words
        var words = text.toLowerCase().replace(/[^\w\s]/gi, '').trim().split(/\s+/).sort();
        // array holds the $word and the #frequncy of it
        var list = [];
        // exclude the common words in case of this strategy is desired
        if (this.Config.excludeCommonWords) {
            var exwords = this.Config.excludedWords;
            // remove the common words
            words = words.filter(function (el) {
                return exwords.indexOf(el) < 0;
            });
        }
        // generate an array of pairs {word and number of occurences}
        while (words.length > 0) {
            var w = words[0];
            var c = (words.lastIndexOf(w) + 1);
            // shrink the words array to count the other words
            // starting from the first word in the shrinked array
            words = words.slice(c);
            // add the word with its occurences count to the list
            // if the word is not excluded
            //if (excluded.indexOf(w) < 0)
            list.push({ word: w, count: c });
        }
        // in case of the desired top N words greater than the number of words
        // hold the available words only
        var len_ = this.Config.topWordsCount > list.length ? list.length : this.Config.topWordsCount;
        // sort the array desceding according to the number of occurences for the word
        // then hold only the top N words
        list = list.sort(
        function (x, y) {
            return y.count - x.count;
        }
        );
        var topWords = list.slice(0, len_);
        // in case of fairstrategy used add the rest of words 
        // which have the same number of occurences ilke the final one
        if (this.Config.fairStrategy && list.length > len_) {
            // number of occurences of the last word in top N 
            var count_ = topWords[len_ - 1].count;
            var index = len_;
            while (count_ == list[index].count) {
                topWords.push(list[index]);
                index++;
            }
        }
        return topWords;
    }

}

module.exports = TextAnalyzer;