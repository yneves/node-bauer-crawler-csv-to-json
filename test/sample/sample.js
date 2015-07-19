// - -------------------------------------------------------------------- - //

"use strict";

var fs = require("fs");
var assert = require("assert");
var Crawler = require("bauer-crawler");

var crawler = new Crawler();

crawler.require(__dirname + "/../../");

crawler.ready(function() {
  
  this.promise()
    .csvToJSON({
      source: __dirname + "/sample.csv",
      parser: {
        delimiter: "\"",
        quote: "",
        escape: "",
        columns: ["date","close","open","high","low","volume"],
        auto_parse: true,
        shift_result: true
      }
    })
    .then(function(file) {
      var output = fs.readFileSync(file).toString();
      var compare = fs.readFileSync(__dirname + "/sample-compare.json").toString();
      assert.deepEqual(output,compare);
      fs.unlinkSync(file);
    })
    .exit();
  
  
});

crawler.start();

// - -------------------------------------------------------------------- - //
