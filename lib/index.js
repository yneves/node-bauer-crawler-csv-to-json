/*!
**  bauer-crawler-pdf-to-text -- Plugin for bauer-crawler to convert pdf into text.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-crawler-pdf-to-text>
*/
// - -------------------------------------------------------------------- - //

"use strict";

module.exports = {
  
  name: "csvToJSON",
  
  config: {
    workers: 1,
    parser: {
      
    },
    cache: {
      json: true,
      expires: 0,
      file: {
        dir: ".",
        ext: "json"
      }
    }
  },
  
  worker: __dirname + "/worker.js",
  promise: __dirname + "/promise.js"
  
};

// - -------------------------------------------------------------------- - //
