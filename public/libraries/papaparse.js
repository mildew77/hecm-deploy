(function (e) {
    "use strict";

    function t(e) {
        return typeof e === "function"
    }

    function n(e, t) {
        function a(n) {
            var r = s + n.target.result;
            s = "";
            if (r.length >= t.chunkSize) {
                var u = r.lastIndexOf("\n");
                if (u < 0) u = r.lastIndexOf("\r");
                if (u > -1) {
                    s = r.substring(u + 1);
                    r = r.substring(0, u)
                }
            }
            var a = o.parse(r);
            if (i >= e.size) return f(n);
            else if (a.errors.abort) return;
            else c()
        }

        function f(n) {
            if (typeof t.onComplete === "function") t.onComplete(undefined, e, t.inputElem, n)
        }

        function l() {
            if (typeof t.onFileError === "function") t.onFileError(u.error, e, t.inputElem)
        }

        function c() {
            if (i < e.size) {
                u.readAsText(e.slice(i, Math.min(i + t.chunkSize, e.size)), t.config.encoding);
                i += t.chunkSize
            }
        }
        if (!t) t = {};
        if (!t.chunkSize) t.chunkSize = 1024 * 1024 * 5;
        if (t.config.step) {
            var n = t.config.step;
            t.config.step = function (r) {
                return n(r, e, t.inputElem)
            }
        }
        var i = 0;
        var s = "";
        var o = new r(t.config);
        var u = new FileReader;
        u.onload = a;
        u.onerror = l;
        this.stream = function (e, n) {
            t.onComplete = e;
            t.onFileError = n;
            c()
        };
    }

    function r(e) {
        function c(e) {
            if (typeof e !== "object") e = {};
            if (typeof e.delimiter !== "string" || e.delimiter.length != 1) e.delimiter = f.delimiter;
            if (e.delimiter == '"' || e.delimiter == "\n") e.delimiter = f.delimiter;
            if (typeof e.header !== "boolean") e.header = f.header;
            if (typeof e.dynamicTyping !== "boolean") e.dynamicTyping = f.dynamicTyping;
            if (typeof e.preview !== "number") e.preview = f.preview;
            if (typeof e.step !== "function") e.step = f.step;
            return e
        }

        function h(e) {
            var t = String.fromCharCode(30);
            var n = String.fromCharCode(31);
            var i = [",", " ", "|", ";", t, n];
            var s, o, a;
            for (var f = 0; f < i.length; f++) {
                var l = i[f];
                var c = 0,
                    h = 0;
                var p = (new r({
                    delimiter: l,
                    header: false,
                    dynamicTyping: false,
                    preview: 10
                })).parse(e);
                for (var d = 0; d < p.results.length; d++) {
                    var v = p.results[d].length;
                    h += v;
                    if (typeof a === "undefined") {
                        a = v;
                        continue
                    } else if (v > 1) {
                        c += Math.abs(v - a);
                        a = v
                    }
                }
                h /= p.results.length;
                if ((typeof o === "undefined" || c < o) && h > 1.99) {
                    o = c;
                    s = l
                }
            }
            u.delimiter = s;
            return !!s
        }

        function p() {
            var e = a.i > 0 && g(a.i - 1) || a.i == 0;
            var t = a.i < i.length - 1 && g(a.i + 1) || a.i == i.length - 1;
            var n = a.i < i.length - 1 && i[a.i + 1] == '"';
            if (a.inQuotes && n) {
                a.fieldVal += '"';
                a.i++
            } else if (e || t) a.inQuotes = !a.inQuotes;
            else N("Quotes", "UnexpectedQuotes", "Unexpected quotes")
        }

        function d() {
            v()
        }

        function v() {
            a.fieldVal += a.ch
        }

        function m() {
            if (a.ch == u.delimiter) y();
            else if (a.ch == "\r" && a.i < i.length - 1 && i[a.i + 1] == "\n" || a.ch == "\n" && a.i < i.length - 1 && i[a.i + 1] == "\r") {
                b();
                a.i++
            } else if (a.ch == "\r" || a.ch == "\n") b();
            else v()
        }

        function g(e) {
            return i[e] == u.delimiter || i[e] == "\n" || i[e] == "\r"
        }

        function y() {  
    if (u.header)
    {
        if (a.lineNum == 1 && n == 1) {

            if ( a.fieldVal == "" || a.fieldVal == " " ){
                a.parsed.fields.push('EMPTY COL NAME');
            } else {
                a.parsed.fields.push(a.fieldVal);
            }                   
        }
        else
        {
            var e = a.parsed.rows[a.parsed.rows.length - 1];

            var t = a.parsed.fields[a.field];

            if (t)
            {
                if (u.dynamicTyping)
                    a.fieldVal = S(a.fieldVal); 
                
                // if undefined, then its NOT a duplicate
                if ( typeof e[t] === "undefined" ) {
                    if ( t == "EMPTY COL NAME" ) {
                        e[t+" #"+a.field] = a.fieldVal; 
                    } else {
                        e[t] = a.fieldVal;  
                    }
                    
                } else {
                    e[t+" #"+a.field] = a.fieldVal; 
                }
                
            }
            else
            {
                if (typeof e.__parsed_extra === 'undefined')
                    e.__parsed_extra = [];
                e.__parsed_extra.push(a.fieldVal);
                e[t] = "EMPTY";
                console.log('must be empty');
            }
        }
    }
    else
    {
        if (u.dynamicTyping)
            a.fieldVal = S(a.fieldVal);
        a.parsed[a.parsed.length - 1].push(a.fieldVal);
    }

    a.fieldVal = "";
    a.field ++;
}

        function b() {
            w();
            if (E()) {
                a.errors = {};
                a.errors.length = 0
            }
            if (u.header) {
                if (a.lineNum > 0) {
                    if (E()) a.parsed.rows = [{}];
                    else a.parsed.rows.push({})
                }
            } else {
                if (E()) a.parsed = [
                    []
                ];
                else if (!u.header) a.parsed.push([])
            }
            a.lineNum++;
            a.line = "";
            a.field = 0
        }

        function w() {
            if (o) return;
            y();
            var e = x();
            if (!e && u.header) T();
            if (E() && (!u.header || u.header && a.parsed.rows.length > 0)) {
                var t = u.step(C());
                if (t === false) o = true
            }
        }

        function E() {
            return typeof u.step === "function"
        }

        function S(e) {
            var t = l.floats.test(e);
            return t ? parseFloat(e) : e
        }

        function x() {
            if (l.empty.test(a.line)) {
                if (u.header) {
                    if (a.lineNum == 1) {
                        a.parsed.fields = [];
                        a.lineNum--
                    } else a.parsed.rows.splice(a.parsed.rows.length - 1, 1)
                } else a.parsed.splice(a.parsed.length - 1, 1);
                return true
            }
            return false
        }

        function T() {
            if (!u.header) return true;
            if (a.parsed.rows.length == 0) return true;
            var e = a.parsed.fields.length;
            var t = 0;
            var n = a.parsed.rows[a.parsed.rows.length - 1];
            for (var r in n)
                if (n.hasOwnProperty(r)) t++;
            if (t < e) return N("FieldMismatch", "TooFewFields", "Too few fields: expected " + e + " fields but parsed " + t);
            else if (t > e) return N("FieldMismatch", "TooManyFields", "Too many fields: expected " + e + " fields but parsed " + t);
            return true
        }

        function N(e, t, n, r) {
            var i = u.header ? a.parsed.rows.length ? a.parsed.rows.length - 1 : undefined : a.parsed.length - 1;
            var o = r || i;
            if (typeof a.errors[o] === "undefined") a.errors[o] = [];
            a.errors[o].push({
                type: e,
                code: t,
                message: n,
                line: a.lineNum,
                row: i,
                index: a.i + s
            });
            a.errors.length++;
            return false
        }

        function C() {
            return {
                results: a.parsed,
                errors: a.errors,
                meta: {
                    delimiter: u.delimiter
                }
            }
        }

        function k(e) {
            n++;
            if (n > 1 && E()) s += e.length;
            a = L();
            i = e
        }

        function L() {
            var e;
            if (u.header) {
                e = {
                    fields: E() ? a.parsed.fields || [] : [],
                    rows: E() && n > 1 ? [{}] : []
                }
            } else e = [
                []
            ];
            return {
                i: 0,
                lineNum: E() ? a.lineNum : 1,
                field: 0,
                fieldVal: "",
                line: "",
                ch: "",
                inQuotes: false,
                parsed: e,
                errors: {
                    length: 0
                }
            }
        }
        var t = this;
        var n = 0;
        var i = "";
        var s = 0;
        var o = false;
        var u = {};
        var a = L();
        var f = {
            delimiter: "",
            header: true,
            dynamicTyping: true,
            preview: 0
        };
        var l = {
            floats: /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,
            empty: /^\s*$/
        };
        e = c(e);
        u = {
            delimiter: e.delimiter,
            header: e.header,
            dynamicTyping: e.dynamicTyping,
            preview: e.preview,
            step: e.step
        };
        this.parse = function (e) {
            if (typeof e !== "string") return C();
            k(e);
            if (!u.delimiter && !h(e)) {
                N("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to comma", "config");
                u.delimiter = ","
            }
            for (a.i = 0; a.i < i.length; a.i++) {
                if (o || u.preview > 0 && a.lineNum > u.preview) break;
                a.ch = i[a.i];
                a.line += a.ch;
                if (a.ch == '"') p();
                else if (a.inQuotes) d();
                else m()
            }
            if (o) N("Abort", "ParseAbort", "Parsing was aborted by the user's step function", "abort");
            else {
                w();
                if (a.inQuotes) N("Quotes", "MissingQuotes", "Unescaped or mismatched quotes")
            }
            return C()
        };
        this.getOptions = function () {
            return {
                delimiter: u.delimiter,
                header: u.header,
                dynamicTyping: u.dynamicTyping,
                preview: u.preview,
                step: u.step
            }
        }
    }
    e.fn.parse = function (r) {
        function o(i) {
            var s = a,
                o;
            if (t(r.error)) o = function () {
                r.error(c.error, i.file, i.inputElem)
            };
            if (t(r.complete)) s = function (e, t, n, i) {
                r.complete(e, t, n, i);
                a()
            };
            if (t(r.before)) {
                var f = r.before(i.file, i.inputElem);
                if (typeof f === "object") i.instanceConfig = e.extend(i.instanceConfig, f);
                else if (f === "skip") return a();
                else if (f === false) {
                    u("AbortError", i.file, i.inputElem);
                    return
                }
            }
            if (i.instanceConfig.step) {
                var l = new n(i.file, {
                    inputElem: i.inputElem,
                    config: e.extend({}, i.instanceConfig)
                });
                l.stream(s, o)
            } else {
                var c = new FileReader;
                c.onerror = o;
                c.onload = function (t) {
                    var n = t.target.result;
                    var r = e.parse(n, i.instanceConfig);
                    s(r, i.file, i.inputElem, t)
                };
                c.readAsText(i.file, i.instanceConfig.encoding)
            }
        }

        function u(e, n, i) {
            if (t(r.error)) r.error({
                name: e
            }, n, i)
        }

        function a() {
            s.splice(0, 1);
            if (s.length > 0) o(s[0])
        }
        var i = r.config || {};
        var s = [];
        this.each(function (t) {
            var n = e(this).prop("tagName").toUpperCase() == "INPUT" && e(this).attr("type") == "file" && window.FileReader;
            if (!n) return true;
            var r = e.extend({}, i);
            if (!this.files || this.files.length == 0) {
                u("NoFileError", undefined, this);
                return true
            }
            for (var a = 0; a < this.files.length; a++) s.push({
                file: this.files[a],
                inputElem: this,
                instanceConfig: r
            });
            if (s.length > 0) o(s[0])
        });
        return this
    };
    e.parse = function (e, t) {
        var n = new r(t);
        return n.parse(e)
    }
})(jQuery);

/*
    Baby Parse
    v0.4.1
    https://github.com/Rich-Harris/BabyParse

    Created by Rich Harris
    Maintained by Matt Holt

    Based on Papa Parse v4.0.7 by Matt Holt
    https://github.com/mholt/PapaParse
*/
(function(global)
{

    // A configuration object from which to draw default settings
    var DEFAULTS = {
        delimiter: "",  // empty: auto-detect
        newline: "",    // empty: auto-detect
        header: false,
        dynamicTyping: false,
        preview: 0,
        step: undefined,
        comments: false,
        complete: undefined,
        skipEmptyLines: false,
        fastMode: false
    };

    var Baby = {};
    Baby.parse = CsvToJson;
    Baby.parseFiles = ParseFiles;
    Baby.unparse = JsonToCsv;
    Baby.RECORD_SEP = String.fromCharCode(30);
    Baby.UNIT_SEP = String.fromCharCode(31);
    Baby.BYTE_ORDER_MARK = "\ufeff";
    Baby.BAD_DELIMITERS = ["\r", "\n", "\"", Baby.BYTE_ORDER_MARK];
    Baby.DefaultDelimiter = ",";        // Used if not specified and detection fails
    Baby.Parser = Parser;               // For testing/dev only
    Baby.ParserHandle = ParserHandle;   // For testing/dev only
    
  /*  var fs = fs || require('fs')*/
    
    function ParseFiles(_input, _config)
    {
        if (Array.isArray(_input)) {
            var results = [];
            _input.forEach(function(input) {
                if(typeof input === 'object')
                    results.push(ParseFiles(input.file, input.config));
                else
                    results.push(ParseFiles(input, _config));
            });
            return results;
        } else {
            var results = {
                data: [],
                errors: []
            };
            if ((/(\.csv|\.txt)$/).test(_input)) {
                try {
                    var contents = fs.readFileSync(_input).toString();
                    return CsvToJson(contents, _config);
                } catch (err) {
                    results.errors.push(err);
                    return results;
                }
            } else {
                results.errors.push({
                    type: '',
                    code: '',
                    message: 'Unsupported file type.',
                    row: ''
                });
                return results;
            }
        }
    }

    function CsvToJson(_input, _config)
    {
        var config = copyAndValidateConfig(_config);
        var ph = new ParserHandle(config);
        var results = ph.parse(_input);
        return results;
    }




    function JsonToCsv(_input, _config)
    {
        var _output = "";
        var _fields = [];

        // Default configuration
        var _quotes = false;    // whether to surround every datum with quotes
        var _delimiter = ",";   // delimiting character
        var _newline = "\r\n";  // newline character(s)

        unpackConfig();

        if (typeof _input === 'string')
            _input = JSON.parse(_input);

        if (_input instanceof Array)
        {
            if (!_input.length || _input[0] instanceof Array)
                return serialize(null, _input);
            else if (typeof _input[0] === 'object')
                return serialize(objectKeys(_input[0]), _input);
        }
        else if (typeof _input === 'object')
        {
            if (typeof _input.data === 'string')
                _input.data = JSON.parse(_input.data);

            if (_input.data instanceof Array)
            {
                if (!_input.fields)
                    _input.fields = _input.data[0] instanceof Array
                                    ? _input.fields
                                    : objectKeys(_input.data[0]);

                if (!(_input.data[0] instanceof Array) && typeof _input.data[0] !== 'object')
                    _input.data = [_input.data];    // handles input like [1,2,3] or ["asdf"]
            }

            return serialize(_input.fields || [], _input.data || []);
        }

        // Default (any valid paths should return before this)
        throw "exception: Unable to serialize unrecognized input";


        function unpackConfig()
        {
            if (typeof _config !== 'object')
                return;

            if (typeof _config.delimiter === 'string'
                && _config.delimiter.length == 1
                && Baby.BAD_DELIMITERS.indexOf(_config.delimiter) == -1)
            {
                _delimiter = _config.delimiter;
            }

            if (typeof _config.quotes === 'boolean'
                || _config.quotes instanceof Array)
                _quotes = _config.quotes;

            if (typeof _config.newline === 'string')
                _newline = _config.newline;
        }


        // Turns an object's keys into an array
        function objectKeys(obj)
        {
            if (typeof obj !== 'object')
                return [];
            var keys = [];
            for (var key in obj)
                keys.push(key);
            return keys;
        }

        // The double for loop that iterates the data and writes out a CSV string including header row
        function serialize(fields, data)
        {
            var csv = "";

            if (typeof fields === 'string')
                fields = JSON.parse(fields);
            if (typeof data === 'string')
                data = JSON.parse(data);

            var hasHeader = fields instanceof Array && fields.length > 0;
            var dataKeyedByField = !(data[0] instanceof Array);

            // If there a header row, write it first
            if (hasHeader)
            {
                for (var i = 0; i < fields.length; i++)
                {
                    if (i > 0)
                        csv += _delimiter;
                    csv += safe(fields[i], i);
                }
                if (data.length > 0)
                    csv += _newline;
            }

            // Then write out the data
            for (var row = 0; row < data.length; row++)
            {
                var maxCol = hasHeader ? fields.length : data[row].length;

                for (var col = 0; col < maxCol; col++)
                {
                    if (col > 0)
                        csv += _delimiter;
                    var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
                    csv += safe(data[row][colIdx], col);
                }

                if (row < data.length - 1)
                    csv += _newline;
            }

            return csv;
        }

        // Encloses a value around quotes if needed (makes a value safe for CSV insertion)
        function safe(str, col)
        {
            if (typeof str === "undefined" || str === null)
                return "";

            str = str.toString().replace(/"/g, '""');

            var needsQuotes = (typeof _quotes === 'boolean' && _quotes)
                            || (_quotes instanceof Array && _quotes[col])
                            || hasAny(str, Baby.BAD_DELIMITERS)
                            || str.indexOf(_delimiter) > -1
                            || str.charAt(0) == ' '
                            || str.charAt(str.length - 1) == ' ';

            return needsQuotes ? '"' + str + '"' : str;
        }

        function hasAny(str, substrings)
        {
            for (var i = 0; i < substrings.length; i++)
                if (str.indexOf(substrings[i]) > -1)
                    return true;
            return false;
        }
    }






    // Use one ParserHandle per entire CSV file or string
    function ParserHandle(_config)
    {
        // One goal is to minimize the use of regular expressions...
        var FLOAT = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;

        var self = this;
        var _stepCounter = 0;   // Number of times step was called (number of rows parsed)
        var _input;             // The input being parsed
        var _parser;            // The core parser being used
        var _paused = false;    // Whether we are paused or not
        var _delimiterError;    // Temporary state between delimiter detection and processing results
        var _fields = [];       // Fields are from the header row of the input, if there is one
        var _results = {        // The last results returned from the parser
            data: [],
            errors: [],
            meta: {}
        };

        if (isFunction(_config.step))
        {
            var userStep = _config.step;
            _config.step = function(results)
            {
                _results = results;

                if (needsHeaderRow())
                    processResults();
                else    // only call user's step function after header row
                {
                    processResults();

                    // It's possbile that this line was empty and there's no row here after all
                    if (_results.data.length == 0)
                        return;

                    _stepCounter += results.data.length;
                    if (_config.preview && _stepCounter > _config.preview)
                        _parser.abort();
                    else
                        userStep(_results, self);
                }
            };
        }

        this.parse = function(input)
        {
            if (!_config.newline)
                _config.newline = guessLineEndings(input);

            _delimiterError = false;
            if (!_config.delimiter)
            {
                var delimGuess = guessDelimiter(input);
                if (delimGuess.successful)
                    _config.delimiter = delimGuess.bestDelimiter;
                else
                {
                    _delimiterError = true; // add error after parsing (otherwise it would be overwritten)
                    _config.delimiter = Baby.DefaultDelimiter;
                }
                _results.meta.delimiter = _config.delimiter;
            }

            var parserConfig = copy(_config);
            if (_config.preview && _config.header)
                parserConfig.preview++; // to compensate for header row

            _input = input;
            _parser = new Parser(parserConfig);
            _results = _parser.parse(_input);
            processResults();
            if (isFunction(_config.complete) && !_paused && (!self.streamer || self.streamer.finished()))
                _config.complete(_results);
            return _paused ? { meta: { paused: true } } : (_results || { meta: { paused: false } });
        };

        this.pause = function()
        {
            _paused = true;
            _parser.abort();
            _input = _input.substr(_parser.getCharIndex());
        };

        this.resume = function()
        {
            _paused = false;
            _parser = new Parser(_config);
            _parser.parse(_input);
            if (!_paused)
            {
                if (self.streamer && !self.streamer.finished())
                    self.streamer.resume();     // more of the file yet to come
                else if (isFunction(_config.complete))
                    _config.complete(_results);
            }
        };

        this.abort = function()
        {
            _parser.abort();
            if (isFunction(_config.complete))
                _config.complete(_results);
            _input = "";
        };

        function processResults()
        {
            if (_results && _delimiterError)
            {
                addError("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '"+Baby.DefaultDelimiter+"'");
                _delimiterError = false;
            }

            if (_config.skipEmptyLines)
            {
                for (var i = 0; i < _results.data.length; i++)
                    if (_results.data[i].length == 1 && _results.data[i][0] == "")
                        _results.data.splice(i--, 1);
            }

            if (needsHeaderRow())
                fillHeaderFields();

            return applyHeaderAndDynamicTyping();
        }

        function needsHeaderRow()
        {
            return _config.header && _fields.length == 0;
        }

        function fillHeaderFields()
        {
            if (!_results)
                return;
            for (var i = 0; needsHeaderRow() && i < _results.data.length; i++)
                for (var j = 0; j < _results.data[i].length; j++)
                    _fields.push(_results.data[i][j]);
            _results.data.splice(0, 1);
        }

        function applyHeaderAndDynamicTyping()
        {
            if (!_results || (!_config.header && !_config.dynamicTyping))
                return _results;

            for (var i = 0; i < _results.data.length; i++)
            {
                var row = {};

                for (var j = 0; j < _results.data[i].length; j++)
                {
                    if (_config.dynamicTyping)
                    {
                        var value = _results.data[i][j];
                        if (value == "true" || value === "TRUE")
                            _results.data[i][j] = true;
                        else if (value == "false" || value === "FALSE")
                            _results.data[i][j] = false;
                        else
                            _results.data[i][j] = tryParseFloat(value);
                    }

                    if (_config.header)
                    {
                        if (j >= _fields.length)
                        {
                            if (!row["__parsed_extra"])
                                row["__parsed_extra"] = [];
                            row["__parsed_extra"].push(_results.data[i][j]);
                        }
                        else
                            row[_fields[j]] = _results.data[i][j];
                    }
                }

                if (_config.header)
                {
                    _results.data[i] = row;
                    if (j > _fields.length)
                        addError("FieldMismatch", "TooManyFields", "Too many fields: expected " + _fields.length + " fields but parsed " + j, i);
                    else if (j < _fields.length)
                        addError("FieldMismatch", "TooFewFields", "Too few fields: expected " + _fields.length + " fields but parsed " + j, i);
                }
            }

            if (_config.header && _results.meta)
                _results.meta.fields = _fields;
            return _results;
        }

        function guessDelimiter(input)
        {
            var delimChoices = [",", "\t", "|", ";", Baby.RECORD_SEP, Baby.UNIT_SEP];
            var bestDelim, bestDelta, fieldCountPrevRow;

            for (var i = 0; i < delimChoices.length; i++)
            {
                var delim = delimChoices[i];
                var delta = 0, avgFieldCount = 0;
                fieldCountPrevRow = undefined;

                var preview = new Parser({
                    delimiter: delim,
                    preview: 10
                }).parse(input);

                for (var j = 0; j < preview.data.length; j++)
                {
                    var fieldCount = preview.data[j].length;
                    avgFieldCount += fieldCount;

                    if (typeof fieldCountPrevRow === 'undefined')
                    {
                        fieldCountPrevRow = fieldCount;
                        continue;
                    }
                    else if (fieldCount > 1)
                    {
                        delta += Math.abs(fieldCount - fieldCountPrevRow);
                        fieldCountPrevRow = fieldCount;
                    }
                }

                avgFieldCount /= preview.data.length;

                if ((typeof bestDelta === 'undefined' || delta < bestDelta)
                    && avgFieldCount > 1.99)
                {
                    bestDelta = delta;
                    bestDelim = delim;
                }
            }

            _config.delimiter = bestDelim;

            return {
                successful: !!bestDelim,
                bestDelimiter: bestDelim
            }
        }

        function guessLineEndings(input)
        {
            input = input.substr(0, 1024*1024); // max length 1 MB

            var r = input.split('\r');

            if (r.length == 1)
                return '\n';

            var numWithN = 0;
            for (var i = 0; i < r.length; i++)
            {
                if (r[i][0] == '\n')
                    numWithN++;
            }

            return numWithN >= r.length / 2 ? '\r\n' : '\r';
        }

        function tryParseFloat(val)
        {
            var isNumber = FLOAT.test(val);
            return isNumber ? parseFloat(val) : val;
        }

        function addError(type, code, msg, row)
        {
            _results.errors.push({
                type: type,
                code: code,
                message: msg,
                row: row
            });
        }
    }






    // The core parser implements speedy and correct CSV parsing
    function Parser(config)
    {
        // Unpack the config object
        config = config || {};
        var delim = config.delimiter;
        var newline = config.newline;
        var comments = config.comments;
        var step = config.step;
        var preview = config.preview;
        var fastMode = config.fastMode;

        // Delimiter must be valid
        if (typeof delim !== 'string'
            || delim.length != 1
            || Baby.BAD_DELIMITERS.indexOf(delim) > -1)
            delim = ",";

        // Comment character must be valid
        if (comments === delim)
            throw "Comment character same as delimiter";
        else if (comments === true)
            comments = "#";
        else if (typeof comments !== 'string'
            || Baby.BAD_DELIMITERS.indexOf(comments) > -1)
            comments = false;

        // Newline must be valid: \r, \n, or \r\n
        if (newline != '\n' && newline != '\r' && newline != '\r\n')
            newline = '\n';

        // We're gonna need these at the Parser scope
        var cursor = 0;
        var aborted = false;

        this.parse = function(input)
        {
            // For some reason, in Chrome, this speeds things up (!?)
            if (typeof input !== 'string')
                throw "Input must be a string";

            // We don't need to compute some of these every time parse() is called,
            // but having them in a more local scope seems to perform better
            var inputLen = input.length,
                delimLen = delim.length,
                newlineLen = newline.length,
                commentsLen = comments.length;
            var stepIsFunction = typeof step === 'function';

            // Establish starting state
            cursor = 0;
            var data = [], errors = [], row = [];

            if (!input)
                return returnable();

            if (fastMode)
            {
                // Fast mode assumes there are no quoted fields in the input
                var rows = input.split(newline);
                for (var i = 0; i < rows.length; i++)
                {
                    if (comments && rows[i].substr(0, commentsLen) == comments)
                        continue;
                    if (stepIsFunction)
                    {
                        data = [ rows[i].split(delim) ];
                        doStep();
                        if (aborted)
                            return returnable();
                    }
                    else
                        data.push(rows[i].split(delim));
                    if (preview && i >= preview)
                    {
                        data = data.slice(0, preview);
                        return returnable(true);
                    }
                }
                return returnable();
            }

            var nextDelim = input.indexOf(delim, cursor);
            var nextNewline = input.indexOf(newline, cursor);

            // Parser loop
            for (;;)
            {
                // Field has opening quote
                if (input[cursor] == '"')
                {
                    // Start our search for the closing quote where the cursor is
                    var quoteSearch = cursor;

                    // Skip the opening quote
                    cursor++;

                    for (;;)
                    {
                        // Find closing quote
                        var quoteSearch = input.indexOf('"', quoteSearch+1);

                        if (quoteSearch === -1)
                        {
                            // No closing quote... what a pity
                            errors.push({
                                type: "Quotes",
                                code: "MissingQuotes",
                                message: "Quoted field unterminated",
                                row: data.length,   // row has yet to be inserted
                                index: cursor
                            });
                            return finish();
                        }

                        if (quoteSearch === inputLen-1)
                        {
                            // Closing quote at EOF
                            row.push(input.substring(cursor, quoteSearch).replace(/""/g, '"'));
                            data.push(row);
                            if (stepIsFunction)
                                doStep();
                            return returnable();
                        }

                        // If this quote is escaped, it's part of the data; skip it
                        if (input[quoteSearch+1] == '"')
                        {
                            quoteSearch++;
                            continue;
                        }

                        if (input[quoteSearch+1] == delim)
                        {
                            // Closing quote followed by delimiter
                            row.push(input.substring(cursor, quoteSearch).replace(/""/g, '"'));
                            cursor = quoteSearch + 1 + delimLen;
                            nextDelim = input.indexOf(delim, cursor);
                            nextNewline = input.indexOf(newline, cursor);
                            break;
                        }

                        if (input.substr(quoteSearch+1, newlineLen) === newline)
                        {
                            // Closing quote followed by newline
                            row.push(input.substring(cursor, quoteSearch).replace(/""/g, '"'));
                            saveRow(quoteSearch + 1 + newlineLen);
                            nextDelim = input.indexOf(delim, cursor);   // because we may have skipped the nextDelim in the quoted field

                            if (stepIsFunction)
                            {
                                doStep();
                                if (aborted)
                                    return returnable();
                            }
                            
                            if (preview && data.length >= preview)
                                return returnable(true);

                            break;
                        }
                    }

                    continue;
                }

                // Comment found at start of new line
                if (comments && row.length === 0 && input.substr(cursor, commentsLen) === comments)
                {
                    if (nextNewline == -1)  // Comment ends at EOF
                        return returnable();
                    cursor = nextNewline + newlineLen;
                    nextNewline = input.indexOf(newline, cursor);
                    nextDelim = input.indexOf(delim, cursor);
                    continue;
                }

                // Next delimiter comes before next newline, so we've reached end of field
                if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1))
                {
                    row.push(input.substring(cursor, nextDelim));
                    cursor = nextDelim + delimLen;
                    nextDelim = input.indexOf(delim, cursor);
                    continue;
                }

                // End of row
                if (nextNewline !== -1)
                {
                    row.push(input.substring(cursor, nextNewline));
                    saveRow(nextNewline + newlineLen);

                    if (stepIsFunction)
                    {
                        doStep();
                        if (aborted)
                            return returnable();
                    }

                    if (preview && data.length >= preview)
                        return returnable(true);

                    continue;
                }

                break;
            }


            return finish();


            // Appends the remaining input from cursor to the end into
            // row, saves the row, calls step, and returns the results.
            function finish()
            {
                row.push(input.substr(cursor));
                data.push(row);
                cursor = inputLen;  // important in case parsing is paused
                if (stepIsFunction)
                    doStep();
                return returnable();
            }

            // Appends the current row to the results. It sets the cursor
            // to newCursor and finds the nextNewline. The caller should
            // take care to execute user's step function and check for
            // preview and end parsing if necessary.
            function saveRow(newCursor)
            {
                data.push(row);
                row = [];
                cursor = newCursor;
                nextNewline = input.indexOf(newline, cursor);
            }

            // Returns an object with the results, errors, and meta.
            function returnable(stopped)
            {
                return {
                    data: data,
                    errors: errors,
                    meta: {
                        delimiter: delim,
                        linebreak: newline,
                        aborted: aborted,
                        truncated: !!stopped
                    }
                };
            }

            // Executes the user's step function and resets data & errors.
            function doStep()
            {
                step(returnable());
                data = [], errors = [];
            }
        };

        // Sets the abort flag
        this.abort = function()
        {
            aborted = true;
        };

        // Gets the cursor position
        this.getCharIndex = function()
        {
            return cursor;
        };
    }




    // Replaces bad config values with good, default ones
    function copyAndValidateConfig(origConfig)
    {
        if (typeof origConfig !== 'object')
            origConfig = {};

        var config = copy(origConfig);

        if (typeof config.delimiter !== 'string'
            || config.delimiter.length != 1
            || Baby.BAD_DELIMITERS.indexOf(config.delimiter) > -1)
            config.delimiter = DEFAULTS.delimiter;

        if (config.newline != '\n'
            && config.newline != '\r'
            && config.newline != '\r\n')
            config.newline = DEFAULTS.newline;

        if (typeof config.header !== 'boolean')
            config.header = DEFAULTS.header;

        if (typeof config.dynamicTyping !== 'boolean')
            config.dynamicTyping = DEFAULTS.dynamicTyping;

        if (typeof config.preview !== 'number')
            config.preview = DEFAULTS.preview;

        if (typeof config.step !== 'function')
            config.step = DEFAULTS.step;

        if (typeof config.complete !== 'function')
            config.complete = DEFAULTS.complete;

        if (typeof config.skipEmptyLines !== 'boolean')
            config.skipEmptyLines = DEFAULTS.skipEmptyLines;

        if (typeof config.fastMode !== 'boolean')
            config.fastMode = DEFAULTS.fastMode;

        return config;
    }

    function copy(obj)
    {
        if (typeof obj !== 'object')
            return obj;
        var cpy = obj instanceof Array ? [] : {};
        for (var key in obj)
            cpy[key] = copy(obj[key]);
        return cpy;
    }

    function isFunction(func)
    {
        return typeof func === 'function';
    }






    // export to Node...
    if ( typeof module !== 'undefined' && module.exports ) {
        module.exports = Baby;
    }

    // ...or as AMD module...
    else if ( typeof define === 'function' && define.amd ) {
        define( function () { return Baby; });
    }

    // ...or as browser global
    else {
        global.Baby = Baby;
    }

})(typeof window !== 'undefined' ? window : this);








