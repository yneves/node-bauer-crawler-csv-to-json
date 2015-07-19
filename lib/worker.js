/*!
**  bauer-crawler-csv-to-json -- Plugin for bauer-crawler to convert CSV into JSON.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-crawler-csv-to-json>
*/
// - -------------------------------------------------------------------- - //

"use strict";

var csvParse = require("csv-parse");
var path = require("path");
var Cache = require("bauer-cache");
var factory = require("bauer-factory");
var merge = require("lodash/object/merge");

// - -------------------------------------------------------------------- - //

module.exports = function(worker,config) {
  
  worker.on("request",function(options,response) {
    
    var input = new Cache({
      file: options.source
    });
    var source = input.getFile();
    
    var parser = merge(config.parser,options.parser);
    
    var output = new Cache(merge(config.cache,options.cache,{
      file: {
        dir: path.dirname(source),
        name: path.basename(source,path.extname(source))
      }
    }));
    
    output.exists(function(error,exists) {
      if (error) {
        response.sendError(error);
        
      } else if (exists) {
        
        output.expired(function(error,expired) {
          if (error) {
            response.sendError(error);
            
          // cache expired, make http request
          } else if (expired) {
            
            doConvert(input,output,parser,response);
            
          // reuse cache
          } else {
            response.sendOk({
              file: output.getFile()
            });
          }
        });
          
      // cache does not exists, make http request
      } else {
        
        doConvert(input,output,parser,response);
        
      }
    });
    
  });
  
  worker.send({ ready: true });
  
};

// - -------------------------------------------------------------------- - //

function doConvert(input,output,parser,response) {

  input.exists(function(error,exists) {
    if (error) {
      response.sendError(error);
      
    } else if (exists) {
      
      input.read(function(error,data) {
        if (error) {
          response.sendError(error);
        } else {
          
          csvParse(data,parser,function(error,parsed) {
            if (error) {
              response.sendError(error);
            } else {
              
              if (factory.isArray(parsed) && parser.shift_result === true) {
                parsed.shift();
              }
              
              output.write(parsed,function(error) {
                if (error) {
                  response.sendError(error);
                } else {
                  
                  response.sendOk({
                    file: output.getFile()
                  });
                }
              });
            }
          });
        }
      });
      
    } else {
      response.sendError(new Error("input not found"));
    }
  });
}
