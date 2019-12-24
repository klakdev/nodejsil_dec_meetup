
const express = require('express');
const cp = require('child_process');

/**
 * A regex that describes the characters that will be
 * removed from a string before calling a command
 * @type {RegExp}
 */
const NOT_ALLOWED_CHARACTERS = /[^a-z/.:\s]/gmi;
const TAINTED = true;

/**
 * Data that is tainted will be stored in this map
 * @type {Map<string, boolean>}
 */
const taintedDataMap = new Map();

function patchReplace() {
    const replace = String.prototype.replace;
    String.prototype.replace = function (substr, replacement) {
        const validSanitizer =
            String(NOT_ALLOWED_CHARACTERS) === String(substr) &&
            replacement === '';

        if (validSanitizer) {
            taintedDataMap.delete(this.valueOf());
        }

        return replace.call(this, substr, replacement)
    }
}

function patchSource() {
    const use = express.application.use;
    express.application.use = function(path, fn) {

        const _fn = function (req, res, next) {
            if (req.query) {
                let {url} = req.query;
                taintedDataMap.set(url, TAINTED);
            }

            return fn.call(this, req, res, next);
        };

        return use.call(this, path, _fn);
    }
}

function patchConcat() {
    const concat = String.prototype.concat;
    String.prototype.concat = function(str) {
        const isResultTainted =
            taintedDataMap.has(this.valueOf()) ||
            taintedDataMap.has(str);

        let result = concat.call(this, str);
        if(isResultTainted){
            taintedDataMap.set(result, TAINTED);
        }

        return result;
    }
}

function patchSink(){
    const exec = cp.exec;
    cp.exec = function(command) {
        if(taintedDataMap.has(command)) {
            console.error('vulnerability at cp.exec', command);
        } else {
            console.log('safe command', command);
        }
        
        return exec(command);
    }
}

patchSource();
patchConcat();
patchSink();
patchReplace();
