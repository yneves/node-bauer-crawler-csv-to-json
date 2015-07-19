/*!
**  bauer-crawler-csv-to-json -- Plugin for bauer-crawler to convert CSV into JSON.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-crawler-csv-to-json>
*/
// - -------------------------------------------------------------------- - //

"use strict";

module.exports = {
  
  csvToJSON: {
    
    // .csvToJSON() :Promise
    0: function() {
      return this.then(function(source) {
        return this.promise().csvToJSON(source);
      });
    },
    
    // .csvToJSON(source String) :Promise
    s: function(source) {
      return this.then(function() {
        return this.promise().csvToJSON({
          source: source
        });
      });
    },
    
    // .csvToJSON(source String, parser Object) :Promise
    so: function(source,parser) {
      return this.then(function() {
        return this.promise().csvToJSON({
          source: source,
          parser: parser
        });
      });
    },
    
    // .csvToJSON(options Object) :Promise
    o: function(options) {
      return this.then(function() {
        return this.requestWorker("csvToJSON",options).get("file");
      });
    }
    
  }
      
};

// - -------------------------------------------------------------------- - //
