/*!
**  bauer-plugin-csv-to-json -- Plugin for bauer-crawler to convert CSV into JSON.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-plugin-csv-to-json>
*/
// - -------------------------------------------------------------------- - //

'use strict';

var csvParse = require('csv-parse');
var path = require('path');
var Cache = require('bauer-cache');
var factory = require('bauer-factory');

// - -------------------------------------------------------------------- - //

module.exports = function(worker, config) {

  worker.on('request', function(options, response) {

    var input = new Cache({
      file: options.source
    });
    var source = input.getFile();

    var parser = factory.merge(options.parser, config.parser);

    var outputFile = {
      file: {
        name: path.basename(source, path.extname(source))
      }
    };

    if (!config.cache.file.dir) {
      outputFile.file.dir = path.dirname(source);
    }

    var outputOptions = factory.merge(options.cache, outputFile, config.cache);
    var output = new Cache(outputOptions);

    output.validate(function(error,valid) {
      if (error) {
        response.sendError(error);
      } else if (valid) {
        response.sendOk({ file: output.getFile() });
      } else {

        input.exists(function(error,exists) {
          if (error) {
            response.sendError(error);
          } else if (exists) {

            input.read(function(error,data) {
              if (error) {
                response.sendError(error);
              } else {

                csvParse(data, parser, function(error,parsed) {
                  if (error) {
                    response.sendError(error);
                  } else {

                    if (factory.isArray(parsed) && parser.shift_result === true) {
                      parsed.shift();
                    }

                    output.write(parsed, function(error) {
                      if (error) {
                        response.sendError(error);
                      } else {
                        response.sendOk({ file: output.getFile() });
                      }
                    });
                  }
                });
              }
            });

          } else {
            response.sendError(new Error('input not found'));
          }
        });
      }
    });
  });

  worker.sendReady();

};

// - -------------------------------------------------------------------- - //
