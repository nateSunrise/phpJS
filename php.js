// PHP JS LIBRARY

/*
    Some of these functions are from http://locutus.io/php/
    Some from around web
    Some https://github.com/n8davis/ wrote
    Enjoy!
*/
function PHP(){}
PHP.map      = function(array,multiple){
	if(typeof multiple === 'undefined') return false;
	if(array.length <= 0) return false
	for(var i = 0 ; i < array.length ; i++){
		array[i] *= multiple;
	}
	return array;
}
PHP.money_format = function(format, number) { 
    var setlocale = require('../strings/setlocale')
    if (typeof number !== 'number') {
        return null
    }
    var regex = /%((=.|[+^(!-])*?)(\d*?)(#(\d+))?(\.(\d+))?([in%])/g
    setlocale('LC_ALL', 0)
    var $global = (typeof window !== 'undefined' ? window : global)
    $global.$locutus = $global.$locutus || {}
    var $locutus = $global.$locutus
    $locutus.php = $locutus.php || {}
    var monetary = $locutus.php.locales[$locutus.php.localeCategories.LC_MONETARY].LC_MONETARY
    var doReplace = function (n0, flags, n2, width, n4, left, n6, right, conversion) {
        var value = ''
        var repl = ''
        if (conversion === '%') {
            return '%'
        }
        var fill = flags && (/=./).test(flags) ? flags.match(/=(.)/)[1] : ' ' // flag: =f (numeric fill)
        var showCurrSymbol = !flags || flags.indexOf('!') === -1
        width = parseInt(width, 10) || 0
        var neg = number < 0
        number = number + ''
        number = neg ? number.slice(1) : number
        var decpos = number.indexOf('.')
        var integer = decpos !== -1 ? number.slice(0, decpos) : number
        var fraction = decpos !== -1 ? number.slice(decpos + 1) : ''
        var _strSplice = function (integerStr, idx, thouSep) {
            var integerArr = integerStr.split('')
            integerArr.splice(idx, 0, thouSep)
            return integerArr.join('')
        }
        var intLen = integer.length
        left = parseInt(left, 10)
        var filler = intLen < left
        if (filler) {
            var fillnum = left - intLen
            integer = new Array(fillnum + 1).join(fill) + integer
        }
        if (flags.indexOf('^') === -1) {
            var thouSep = monetary.mon_thousands_sep
            var monGrouping = monetary.mon_grouping
            if (monGrouping[0] < integer.length) {
                for (var i = 0, idx = integer.length; i < monGrouping.length; i++) {
                    idx -= monGrouping[i]
                    if (idx <= 0) {
                        break
                    }
                    if (filler && idx < fillnum) {
                        thouSep = fill
                    }
                    integer = _strSplice(integer, idx, thouSep)
                }
            }
            if (monGrouping[i - 1] > 0) {
                while (idx > monGrouping[i - 1]) {
                    idx -= monGrouping[i - 1]
                    if (filler && idx < fillnum) {
                        thouSep = fill
                    }
                    integer = _strSplice(integer, idx, thouSep)
                }
            }
        }
        if (right === '0') {
            value = integer
        } else {
            var decPt = monetary.mon_decimal_point
            if (right === '' || right === undefined) {
                right = conversion === 'i' ? monetary.int_frac_digits : monetary.frac_digits
            }
            right = parseInt(right, 10)
            if (right === 0) {
                fraction = ''
                decPt = ''
            } else if (right < fraction.length) {
                fraction = Math.round(parseFloat(
                    fraction.slice(0, right) + '.' + fraction.substr(right, 1)
                ))
                if (right > fraction.length) {
                    fraction = new Array(right - fraction.length + 1).join('0') + fraction // prepend with 0's
                }
            } else if (right > fraction.length) {
                fraction += new Array(right - fraction.length + 1).join('0') // pad with 0's
            }
            value = integer + decPt + fraction
        }
        var symbol = ''
        if (showCurrSymbol) {
            symbol = conversion === 'i' ? monetary.int_curr_symbol : monetary.currency_symbol
        }
        var signPosn = neg ? monetary.n_sign_posn : monetary.p_sign_posn
        var sepBySpace = neg ? monetary.n_sep_by_space : monetary.p_sep_by_space
        var csPrecedes = neg ? monetary.n_cs_precedes : monetary.p_cs_precedes
        if (flags.indexOf('(') !== -1) {
            repl = (csPrecedes ? symbol + (sepBySpace === 1 ? ' ' : '') : '') + value + (!csPrecedes ? (
                        sepBySpace === 1 ? ' ' : '') + symbol : '')
            if (neg) {
                repl = '(' + repl + ')'
            } else {
                repl = ' ' + repl + ' '
            }
        } else {
            var posSign = monetary.positive_sign
            var negSign = monetary.negative_sign
            var sign = neg ? (negSign) : (posSign)
            var otherSign = neg ? (posSign) : (negSign)
            var signPadding = ''
            if (signPosn) {
                signPadding = new Array(otherSign.length - sign.length + 1).join(' ')
            }
            var valueAndCS = ''
            switch (signPosn) {
                case 0:
                    valueAndCS = csPrecedes
                        ? symbol + (sepBySpace === 1 ? ' ' : '') + value
                        : value + (sepBySpace === 1 ? ' ' : '') + symbol
                    repl = '(' + valueAndCS + ')'
                    break
                case 1:
                    valueAndCS = csPrecedes
                        ? symbol + (sepBySpace === 1 ? ' ' : '') + value
                        : value + (sepBySpace === 1 ? ' ' : '') + symbol
                    repl = signPadding + sign + (sepBySpace === 2 ? ' ' : '') + valueAndCS
                    break
                case 2:
                    valueAndCS = csPrecedes
                        ? symbol + (sepBySpace === 1 ? ' ' : '') + value
                        : value + (sepBySpace === 1 ? ' ' : '') + symbol
                    repl = valueAndCS + (sepBySpace === 2 ? ' ' : '') + sign + signPadding
                    break
                case 3:
                    repl = csPrecedes
                        ? signPadding + sign + (sepBySpace === 2 ? ' ' : '') + symbol +
                        (sepBySpace === 1 ? ' ' : '') + value
                        : value + (sepBySpace === 1 ? ' ' : '') + sign + signPadding +
                        (sepBySpace === 2 ? ' ' : '') + symbol
                    break
                case 4:
                    repl = csPrecedes
                        ? symbol + (sepBySpace === 2 ? ' ' : '') + signPadding + sign +
                        (sepBySpace === 1 ? ' ' : '') + value
                        : value + (sepBySpace === 1 ? ' ' : '') + symbol +
                        (sepBySpace === 2 ? ' ' : '') + sign + signPadding
                    break
            }
        }
        var padding = width - repl.length
        if (padding > 0) {
            padding = new Array(padding + 1).join(' ')
            if (flags.indexOf('-') !== -1) {
                repl += padding
            } else {
                repl = padding + repl
            }
        }
        return repl
    }
    return format.replace(regex, doReplace)
}
PHP.empty = function(mixedVar){
  var undef
  var key
  var i
  var len
  var emptyValues = [undef, null, false, 0, '', '0']
  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
      return true
    }
  }
  if (typeof mixedVar === 'object') {
    for (key in mixedVar) {
      if (mixedVar.hasOwnProperty(key)) {
        return false
      }
    }
    return true
  }
  return false
}
PHP.is_bool  = function(bool){
	
  return (bool === true || bool === false);
}
PHP.is_int = function(int){


	return int === +int && isFinite(int) && !(int % 1)
}
PHP.get_url_param = function( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}
PHP.once = function(fn, context) { 
  var result;

  return function() { 
    if(fn) {
      result = fn.apply(context || this, arguments);
      fn = null;
    }

    return result;
  };
}
PHP.gettype = function(mixedVar) {
  var isFloat = require('../var/is_float')
  var s = typeof mixedVar
  var name
  var _getFuncName = function (fn) {
    var name = (/\W*function\s+([\w$]+)\s*\(/).exec(fn)
    if (!name) {
      return '(Anonymous)'
    }
    return name[1]
  }
  if (s === 'object') {
    if (mixedVar !== null) {
      if (typeof mixedVar.length === 'number' &&
        !(mixedVar.propertyIsEnumerable('length')) &&
        typeof mixedVar.splice === 'function') {
        s = 'array'
      } else if (mixedVar.constructor && _getFuncName(mixedVar.constructor)) {
        name = _getFuncName(mixedVar.constructor)
        if (name === 'Date') {
          s = 'date'
        } else if (name === 'RegExp') {
          s = 'regexp'
        } else if (name === 'LOCUTUS_Resource') {
          s = 'resource'
        }
      }
    } else {
      s = 'null'
    }
  } else if (s === 'number') {
    s = isFloat(mixedVar) ? 'double' : 'integer'
  }
  return s
}
PHP.ucwords = function(str) {
  return (str + '')
    .replace(/^(.)|\s+(.)/g, function ($1) {
      return $1.toUpperCase()
    })
}
PHP.ucfirst = function(str) {
  str += ''
  var f = str.charAt(0)
    .toUpperCase()
  return f + str.substr(1)
}
PHP.is_json   = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
PHP.array_key_exists = function(key, search) { 
  if (!search || (search.constructor !== Array && search.constructor !== Object)) {
    return false
  }
  return key in search
}
PHP.object_key_exists = function(key,obj){
  for(var k in obj){
    if(k === key){
      return obj[key];
    }
  }
  return false;
}
PHP.isset =  function isset(){
  var a = arguments
  var l = a.length
  var i = 0
  var undef
  if (l === 0) {
    throw new Error('Empty isset')
  }
  while (i !== l) {
    if (a[i] === undef || a[i] === null) {
      return false
    }
    i++
  }
  return true
}
PHP.htmlspecialchars_decode = function(string, quoteStyle) { 
  var optTemp = 0
  var i = 0
  var noquotes = false
  if (typeof quoteStyle === 'undefined') {
    quoteStyle = 2
  }
  string = string.toString()
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  }
  if (quoteStyle === 0) {
    noquotes = true
  }
  if (typeof quoteStyle !== 'number') {
    quoteStyle = [].concat(quoteStyle)
    for (i = 0; i < quoteStyle.length; i++) {
      if (OPTS[quoteStyle[i]] === 0) {
        noquotes = true
      } else if (OPTS[quoteStyle[i]]) {
        optTemp = optTemp | OPTS[quoteStyle[i]]
      }
    }
    quoteStyle = optTemp
  }
  if (quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/&#0*39;/g, "'")
  }
  if (!noquotes) {
    string = string.replace(/&quot;/g, '"')
  }
  string = string.replace(/&amp;/g, '&')
  return string
}
PHP.htmlentities = function(string, quoteStyle, charset, doubleEncode) {
  var getHtmlTranslationTable = require('../strings/get_html_translation_table')
  var hashMap = getHtmlTranslationTable('HTML_ENTITIES', quoteStyle)
  string = string === null ? '' : string + ''
  if (!hashMap) {
    return false
  }
  if (quoteStyle && quoteStyle === 'ENT_QUOTES') {
    hashMap["'"] = '&#039;'
  }
  doubleEncode = doubleEncode === null || !!doubleEncode
  var regex = new RegExp('&(?:#\\d+|#x[\\da-f]+|[a-zA-Z][\\da-z]*);|[' +
    Object.keys(hashMap)
    .join('')
    .replace(/([()[\]{}\-.*+?^$|/\\])/g, '\\$1') + ']',
    'g')
  return string.replace(regex, function (ent) {
    if (ent.length > 1) {
      return doubleEncode ? hashMap['&'] + ent.substr(1) : ent
    }
    return hashMap[ent]
  })
}
PHP.htmlspecialchars = function(string, quoteStyle, charset, doubleEncode) {
  var optTemp = 0
  var i = 0
  var noquotes = false
  if (typeof quoteStyle === 'undefined' || quoteStyle === null) {
    quoteStyle = 2
  }
  string = string || ''
  string = string.toString()
  if (doubleEncode !== false) {
    // Put this first to avoid double-encoding
    string = string.replace(/&/g, '&amp;')
  }
  string = string
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  }
  if (quoteStyle === 0) {
    noquotes = true
  }
  if (typeof quoteStyle !== 'number') {
    quoteStyle = [].concat(quoteStyle)
    for (i = 0; i < quoteStyle.length; i++) {
      if (OPTS[quoteStyle[i]] === 0) {
        noquotes = true
      } else if (OPTS[quoteStyle[i]]) {
        optTemp = optTemp | OPTS[quoteStyle[i]]
      }
    }
    quoteStyle = optTemp
  }
  if (quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/'/g, '&#039;')
  }
  if (!noquotes) {
    string = string.replace(/"/g, '&quot;')
  }
  return string
}
PHP.last_error_json = function(errno){
 var $global = (typeof window !== 'undefined' ? window : global)
  return typeof errno !== 'undefined' ? errno : 0
}
PHP.json_decode = function(strJson) {
  var $global      = (typeof window !== 'undefined' ? window : global)
  var json         = $global.JSON
  if (typeof json === 'object' && typeof json.parse === 'function') {
    try {
      return json.parse(strJson)
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        throw new Error('Unexpected error type in json_decode()')
      }
      PHP.last_error_json(4);
      return null
    }
  }
  var chars = [
    '\u0000',
    '\u00ad',
    '\u0600-\u0604',
    '\u070f',
    '\u17b4',
    '\u17b5',
    '\u200c-\u200f',
    '\u2028-\u202f',
    '\u2060-\u206f',
    '\ufeff',
    '\ufff0-\uffff'
  ].join('')
  var cx = new RegExp('[' + chars + ']', 'g')
  var j
  var text = strJson
  cx.lastIndex = 0
  if (cx.test(text)) {
    text = text.replace(cx, function (a) {
      return '\\u' + ('0000' + a.charCodeAt(0)
        .toString(16))
        .slice(-4)
    })
  }
  var m = (/^[\],:{}\s]*$/)
    .test(text.replace(/\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g, ']')
    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))
  if (m) {
    j = eval('(' + text + ')')
    return j
  }
  PHP.last_error_json(4);
  return null
}
PHP.json_encode = function(mixedVal) { 
  var $global = (typeof window !== 'undefined' ? window : global)
  var json = $global.JSON
  var retVal
  try {
    if (typeof json === 'object' && typeof json.stringify === 'function') {
      // Errors will not be caught here if our own equivalent to resource
      retVal = json.stringify(mixedVal)
      if (retVal === undefined) {
        throw new SyntaxError('json_encode')
      }
      return retVal
    }
    var value = mixedVal
    var quote = function (string) {
      var escapeChars = [
        '\u0000-\u001f',
        '\u007f-\u009f',
        '\u00ad',
        '\u0600-\u0604',
        '\u070f',
        '\u17b4',
        '\u17b5',
        '\u200c-\u200f',
        '\u2028-\u202f',
        '\u2060-\u206f',
        '\ufeff',
        '\ufff0-\uffff'
      ].join('')
      var escapable = new RegExp('[\\"' + escapeChars + ']', 'g')
      var meta = {
        // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
      }
      escapable.lastIndex = 0
      return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
        var c = meta[a]
        return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0)
          .toString(16))
          .slice(-4)
      }) + '"' : '"' + string + '"'
    }
    var _str = function (key, holder) {
      var gap = ''
      var indent = '    '
      // The loop counter.
      var i = 0
      // The member key.
      var k = ''
      var v = ''
      var length = 0
      var mind = gap
      var partial = []
      var value = holder[key]
      if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
        value = value.toJSON(key)
      }
      switch (typeof value) {
        case 'string':
          return quote(value)
        case 'number':
          return isFinite(value) ? String(value) : 'null'
        case 'boolean':
        case 'null':
          return String(value)
        case 'object':
          if (!value) {
            return 'null'
          }
          gap += indent
          partial = []
          if (Object.prototype.toString.apply(value) === '[object Array]') {
            length = value.length
            for (i = 0; i < length; i += 1) {
              partial[i] = _str(i, value) || 'null'
            }
            v = partial.length === 0 ? '[]' : gap
              ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
              : '[' + partial.join(',') + ']'
            gap = mind
            return v
          }
          for (k in value) {
            if (Object.hasOwnProperty.call(value, k)) {
              v = _str(k, value)
              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v)
              }
            }
          }
          v = partial.length === 0 ? '{}' : gap
            ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
            : '{' + partial.join(',') + '}'
          gap = mind
          return v
        case 'undefined':
        case 'function':
        default:
          throw new SyntaxError('json_encode')
      }
    }
    return _str('', {
      '': value
    })
  } catch (err) {
    if (!(err instanceof SyntaxError)) {
      throw new Error('Unexpected error type in json_encode()')
    }
    // usable by json_last_error()
    PHP.last_error_json(4)
    return null
  }
}
PHP.explode  = function(delimiter, string, limit) {
  if (arguments.length < 2 ||
    typeof delimiter === 'undefined' ||
    typeof string === 'undefined') {
    return null
  }
  if (delimiter === '' ||
    delimiter === false ||
    delimiter === null) {
    return false
  }
  if (typeof delimiter === 'function' ||
    typeof delimiter === 'object' ||
    typeof string === 'function' ||
    typeof string === 'object') {
    return {
      0: ''
    }
  }
  if (delimiter === true) {
    delimiter = '1'
  }

  delimiter += ''
  string += ''
  var s = string.split(delimiter)
  if (typeof limit === 'undefined') return s
  // Support for limit
  if (limit === 0) limit = 1
  // Positive limit
  if (limit > 0) {
    if (limit >= s.length) {
      return s
    }
    return s
      .slice(0, limit - 1)
      .concat([s.slice(limit - 1)
        .join(delimiter)
      ])
  }
  // Negative limit
  if (-limit >= s.length) {
    return []
  }
  s.splice(s.length + limit)
  return s
}
PHP.echo     = function(){
  var args = Array.prototype.slice.call(arguments)
  return console.log(args.join(' '))
}
PHP.strlen = function strlen (string) {
  var str = string + ''
  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('unicode.semantics') : undefined) || 'off'
  if (iniVal === 'off') {
    return str.length
  }
  var i = 0
  var lgth = 0
  var getWholeChar = function (str, i) {
    var code = str.charCodeAt(i)
    var next = ''
    var prev = ''
    if (code >= 0xD800 && code <= 0xDBFF) {
      if (str.length <= (i + 1)) {
        throw new Error('High surrogate without following low surrogate')
      }
      next = str.charCodeAt(i + 1)
      if (next < 0xDC00 || next > 0xDFFF) {
        throw new Error('High surrogate without following low surrogate')
      }
      return str.charAt(i) + str.charAt(i + 1)
    } else if (code >= 0xDC00 && code <= 0xDFFF) {
      if (i === 0) {
        throw new Error('Low surrogate without preceding high surrogate')
      }
      prev = str.charCodeAt(i - 1)
      if (prev < 0xD800 || prev > 0xDBFF) {
        throw new Error('Low surrogate without preceding high surrogate')
      }
      return false
    }
    return str.charAt(i)
  }
  for (i = 0, lgth = 0; i < str.length; i++) {
    if ((getWholeChar(str, i)) === false) {
      continue
    }
    lgth++
  }
  return lgth
}
PHP.addslashes = function(str){
  return (str + '')
    .replace(/[\\"']/g, '\\$&')
    .replace(/\u0000/g, '\\0')
}
PHP.addcslashes = function (str, charlist) {
  var target = ''
  var chrs = []
  var i = 0
  var j = 0
  var c = ''
  var next = ''
  var rangeBegin = ''
  var rangeEnd = ''
  var chr = ''
  var begin = 0
  var end = 0
  var octalLength = 0
  var postOctalPos = 0
  var cca = 0
  var escHexGrp = []
  var encoded = ''
  var percentHex = /%([\dA-Fa-f]+)/g
  var _pad = function (n, c) {
    if ((n = n + '').length < c) {
      return new Array(++c - n.length).join('0') + n
    }
    return n
  }
  for (i = 0; i < charlist.length; i++) {
    c = charlist.charAt(i)
    next = charlist.charAt(i + 1)
    if (c === '\\' && next && (/\d/).test(next)) {
      rangeBegin = charlist.slice(i + 1).match(/^\d+/)[0]
      octalLength = rangeBegin.length
      postOctalPos = i + octalLength + 1
      if (charlist.charAt(postOctalPos) + charlist.charAt(postOctalPos + 1) === '..') {
        begin = rangeBegin.charCodeAt(0)
        if ((/\\\d/).test(charlist.charAt(postOctalPos + 2) + charlist.charAt(postOctalPos + 3))) {
          rangeEnd = charlist.slice(postOctalPos + 3).match(/^\d+/)[0]
          i += 1
        } else if (charlist.charAt(postOctalPos + 2)) {
          rangeEnd = charlist.charAt(postOctalPos + 2)
        } else {
          throw new Error('Range with no end point')
        }
        end = rangeEnd.charCodeAt(0)
        if (end > begin) {
          for (j = begin; j <= end; j++) {
            chrs.push(String.fromCharCode(j))
          }
        } else {
          chrs.push('.', rangeBegin, rangeEnd)
        }
        i += rangeEnd.length + 2
      } else {
        chr = String.fromCharCode(parseInt(rangeBegin, 8))
        chrs.push(chr)
      }
      i += octalLength
    } else if (next + charlist.charAt(i + 2) === '..') {
      rangeBegin = c
      begin = rangeBegin.charCodeAt(0)
      if ((/\\\d/).test(charlist.charAt(i + 3) + charlist.charAt(i + 4))) {
        rangeEnd = charlist.slice(i + 4).match(/^\d+/)[0]
        i += 1
      } else if (charlist.charAt(i + 3)) {
        rangeEnd = charlist.charAt(i + 3)
      } else {
        throw new Error('Range with no end point')
      }
      end = rangeEnd.charCodeAt(0)
      if (end > begin) {
        for (j = begin; j <= end; j++) {
          chrs.push(String.fromCharCode(j))
        }
      } else {
        chrs.push('.', rangeBegin, rangeEnd)
      }
      i += rangeEnd.length + 2
    } else {
      chrs.push(c)
    }
  }
  for (i = 0; i < str.length; i++) {
    c = str.charAt(i)
    if (chrs.indexOf(c) !== -1) {
      target += '\\'
      cca = c.charCodeAt(0)
      if (cca < 32 || cca > 126) {
        switch (c) {
          case '\n':
            target += 'n'
            break
          case '\t':
            target += 't'
            break
          case '\u000D':
            target += 'r'
            break
          case '\u0007':
            target += 'a'
            break
          case '\v':
            target += 'v'
            break
          case '\b':
            target += 'b'
            break
          case '\f':
            target += 'f'
            break
          default:
            encoded = encodeURIComponent(c)
            if ((escHexGrp = percentHex.exec(encoded)) !== null) {
              target += _pad(parseInt(escHexGrp[1], 16).toString(8), 3)
            }
            while ((escHexGrp = percentHex.exec(encoded)) !== null) {
              target += '\\' + _pad(parseInt(escHexGrp[1], 16).toString(8), 3)
            }
            break
        }
      } else {
        target += c
      }
    } else {
      target += c
    }
  }
  return target
}
PHP.implode  = function(){
  var i = ''
  var retVal = ''
  var tGlue = ''
  if (arguments.length === 1) {
    pieces = glue
    glue = ''
  }
  if (typeof pieces === 'object') {
    if (Object.prototype.toString.call(pieces) === '[object Array]') {
      return pieces.join(glue)
    }
    for (i in pieces) {
      retVal += tGlue + pieces[i]
      tGlue = glue
    }
    return retVal
  }
  return pieces
}
PHP.rand = function(min,max){
  var argc = arguments.length
  if (argc === 0) {
    min = 0
    max = 2147483647
  } else if (argc === 1) {
    throw new Error('Warning: rand() expects exactly 2 parameters, 1 given')
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}
PHP.strpos = function(haystack, needle, offset) {
  var i = (haystack + '')
    .indexOf(needle, (offset || 0))
  return i === -1 ? false : i
}
PHP.str_replace = function(search, replace, subject, countObj) {
  var i = 0
  var j = 0
  var temp = ''
  var repl = ''
  var sl = 0
  var fl = 0
  var f = [].concat(search)
  var r = [].concat(replace)
  var s = subject
  var ra = Object.prototype.toString.call(r) === '[object Array]'
  var sa = Object.prototype.toString.call(s) === '[object Array]'
  s = [].concat(s)
  var $global = (typeof window !== 'undefined' ? window : global)

  if (typeof (search) === 'object' && typeof (replace) === 'string') {
    temp = replace
    replace = []
    for (i = 0; i < search.length; i += 1) {
      replace[i] = temp
    }
    temp = ''
    r = [].concat(replace)
    ra = Object.prototype.toString.call(r) === '[object Array]'
  }
  if (typeof countObj !== 'undefined') {
    countObj.value = 0
  }
  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + ''
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0]
      s[i] = (temp).split(f[j]).join(repl)
      if (typeof countObj !== 'undefined') {
        countObj.value += ((temp.split(f[j])).length - 1)
      }
    }
  }
  return sa ? s : s[0]
}
PHP.strtolower = function(str) {
  return (str + '')
    .toLowerCase()
}
PHP.strtoupper = function(str) {
  return (str + '')
    .toUpperCase()
}
PHP.trim = function(str, charlist) {
  var whitespace = [
    ' ',
    '\n',
    '\r',
    '\t',
    '\f',
    '\x0b',
    '\xa0',
    '\u2000',
    '\u2001',
    '\u2002',
    '\u2003',
    '\u2004',
    '\u2005',
    '\u2006',
    '\u2007',
    '\u2008',
    '\u2009',
    '\u200a',
    '\u200b',
    '\u2028',
    '\u2029',
    '\u3000'
  ].join('')
  var l = 0
  var i = 0
  str += ''
  if (charlist) {
    whitespace = (charlist + '').replace(/([[\]().?/*{}+$^:])/g, '$1')
  }
  l = str.length
  for (i = 0; i < l; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i)
      break
    }
  }
  l = str.length
  for (i = l - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1)
      break
    }
  }
  return whitespace.indexOf(str.charAt(0)) === -1 ? str : ''
}
PHP.var_dump = function(){
  var echo = this.echo
  var output = ''
  var padChar = ' '
  var padVal = 4
  var lgth = 0
  var i = 0
  var _getFuncName = function (fn) {
    var name = (/\W*function\s+([\w$]+)\s*\(/)
      .exec(fn)
    if (!name) {
      return '(Anonymous)'
    }
    return name[1]
  }
  var _repeatChar = function (len, padChar) {
    var str = ''
    for (var i = 0; i < len; i++) {
      str += padChar
    }
    return str
  }
  var _getInnerVal = function (val, thickPad) {
    var ret = ''
    if (val === null) {
      ret = 'NULL'
    } else if (typeof val === 'boolean') {
      ret = 'bool(' + val + ')'
    } else if (typeof val === 'string') {
      ret = 'string(' + val.length + ') "' + val + '"'
    } else if (typeof val === 'number') {
      if (parseFloat(val) === parseInt(val, 10)) {
        ret = 'int(' + val + ')'
      } else {
        ret = 'float(' + val + ')'
      }
    } else if (typeof val === 'undefined') {
      // The remaining are not PHP behavior because these values
      // only exist in this exact form in JavaScript
      ret = 'undefined'
    } else if (typeof val === 'function') {
      var funcLines = val.toString()
        .split('\n')
      ret = ''
      for (var i = 0, fll = funcLines.length; i < fll; i++) {
        ret += (i !== 0 ? '\n' + thickPad : '') + funcLines[i]
      }
    } else if (val instanceof Date) {
      ret = 'Date(' + val + ')'
    } else if (val instanceof RegExp) {
      ret = 'RegExp(' + val + ')'
    } else if (val.nodeName) {
      // Different than PHP's DOMElement
      switch (val.nodeType) {
        case 1:
          if (typeof val.namespaceURI === 'undefined' ||
            val.namespaceURI === 'http://www.w3.org/1999/xhtml') {
          // Undefined namespace could be plain XML, but namespaceURI not widely supported
            ret = 'HTMLElement("' + val.nodeName + '")'
          } else {
            ret = 'XML Element("' + val.nodeName + '")'
          }
          break
        case 2:
          ret = 'ATTRIBUTE_NODE(' + val.nodeName + ')'
          break
        case 3:
          ret = 'TEXT_NODE(' + val.nodeValue + ')'
          break
        case 4:
          ret = 'CDATA_SECTION_NODE(' + val.nodeValue + ')'
          break
        case 5:
          ret = 'ENTITY_REFERENCE_NODE'
          break
        case 6:
          ret = 'ENTITY_NODE'
          break
        case 7:
          ret = 'PROCESSING_INSTRUCTION_NODE(' + val.nodeName + ':' + val.nodeValue + ')'
          break
        case 8:
          ret = 'COMMENT_NODE(' + val.nodeValue + ')'
          break
        case 9:
          ret = 'DOCUMENT_NODE'
          break
        case 10:
          ret = 'DOCUMENT_TYPE_NODE'
          break
        case 11:
          ret = 'DOCUMENT_FRAGMENT_NODE'
          break
        case 12:
          ret = 'NOTATION_NODE'
          break
      }
    }
    return ret
  }
  var _formatArray = function (obj, curDepth, padVal, padChar) {
    if (curDepth > 0) {
      curDepth++
    }
    var basePad = _repeatChar(padVal * (curDepth - 1), padChar)
    var thickPad = _repeatChar(padVal * (curDepth + 1), padChar)
    var str = ''
    var val = ''
    if (typeof obj === 'object' && obj !== null) {
      if (obj.constructor && _getFuncName(obj.constructor) === 'LOCUTUS_Resource') {
        return obj.var_dump()
      }
      lgth = 0
      for (var someProp in obj) {
        if (obj.hasOwnProperty(someProp)) {
          lgth++
        }
      }
      str += 'array(' + lgth + ') {\n'
      for (var key in obj) {
        var objVal = obj[key]
        if (typeof objVal === 'object' &&
          objVal !== null &&
          !(objVal instanceof Date) &&
          !(objVal instanceof RegExp) &&
          !objVal.nodeName) {
          str += thickPad
          str += '['
          str += key
          str += '] =>\n'
          str += thickPad
          str += _formatArray(objVal, curDepth + 1, padVal, padChar)
        } else {
          val = _getInnerVal(objVal, thickPad)
          str += thickPad
          str += '['
          str += key
          str += '] =>\n'
          str += thickPad
          str += val
          str += '\n'
        }
      }
      str += basePad + '}\n'
    } else {
      str = _getInnerVal(obj, thickPad)
    }
    return str
  }
  output = _formatArray(arguments[0], 0, padVal, padChar)
  for (i = 1; i < arguments.length; i++) {
    output += '\n' + _formatArray(arguments[i], 0, padVal, padChar)
  }
  echo(output)
  // Not how PHP does it, but helps us test:
  return output
}
PHP.array_merge = function() { 
  var args = Array.prototype.slice.call(arguments)
  var argl = args.length
  var arg
  var retObj = {}
  var k = ''
  var argil = 0
  var j = 0
  var i = 0
  var ct = 0
  var toStr = Object.prototype.toString
  var retArr = true
  for (i = 0; i < argl; i++) {
    if (toStr.call(args[i]) !== '[object Array]') {
      retArr = false
      break
    }
  }
  if (retArr) {
    retArr = []
    for (i = 0; i < argl; i++) {
      retArr = retArr.concat(args[i])
    }
    return retArr
  }
  for (i = 0, ct = 0; i < argl; i++) {
    arg = args[i]
    if (toStr.call(arg) === '[object Array]') {
      for (j = 0, argil = arg.length; j < argil; j++) {
        retObj[ct++] = arg[j]
      }
    } else {
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          if (parseInt(k, 10) + '' === k) {
            retObj[ct++] = arg[k]
          } else {
            retObj[k] = arg[k]
          }
        }
      }
    }
  }
  return retObj
}
PHP.in_array = function(needle, haystack, argStrict){
  var key = ''
  var strict = !!argStrict
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) { // eslint-disable-line eqeqeq
        return true
      }
    }
  }
  return false
}
PHP.urlencode = function(str) {
  str = (str + '')
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '+')
}
PHP.urldecode = function(str){
  return decodeURIComponent((str + '')
    .replace(/%(?![\da-f]{2})/gi, function () {
      return '%25'
    })
    .replace(/\+/g, '%20'))
}
PHP.date = function (format, timestamp) {
  var jsdate, f
  var txtWords = [
    'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  var formatChr = /\\?(.?)/gi
  var formatChrCb = function (t, s) {
    return f[t] ? f[t]() : s
  }
  var _pad = function (n, c) {
    n = String(n)
    while (n.length < c) {
      n = '0' + n
    }
    return n
  }
  f = {
    d: function () {
      return _pad(f.j(), 2)
    },
    D: function () {
      return f.l()
        .slice(0, 3)
    },
    j: function () {
      return jsdate.getDate()
    },
    l: function () {
      return txtWords[f.w()] + 'day'
    },
    N: function () {
      return f.w() || 7
    },
    S: function () {
      var j = f.j()
      var i = j % 10
      if (i <= 3 && parseInt((j % 100) / 10, 10) === 1) {
        i = 0
      }
      return ['st', 'nd', 'rd'][i - 1] || 'th'
    },
    w: function () {
      return jsdate.getDay()
    },
    z: function () {
      var a = new Date(f.Y(), f.n() - 1, f.j())
      var b = new Date(f.Y(), 0, 1)
      return Math.round((a - b) / 864e5)
    },
    W: function () {
      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3)
      var b = new Date(a.getFullYear(), 0, 4)
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2)
    },
    F: function () {
      return txtWords[6 + f.n()]
    },
    m: function () {
      return _pad(f.n(), 2)
    },
    M: function () {
      return f.F()
        .slice(0, 3)
    },
    n: function () {
      return jsdate.getMonth() + 1
    },
    t: function () {
      return (new Date(f.Y(), f.n(), 0))
        .getDate()
    },
    L: function () {
      var j = f.Y()
      return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0
    },
    o: function () {
      var n = f.n()
      var W = f.W()
      var Y = f.Y()
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0)
    },
    Y: function () {
      return jsdate.getFullYear()
    },
    y: function () {
      return f.Y()
        .toString()
        .slice(-2)
    },
    a: function () {
      return jsdate.getHours() > 11 ? 'pm' : 'am'
    },
    A: function () {
      return f.a()
        .toUpperCase()
    },
    B: function () {
      var H = jsdate.getUTCHours() * 36e2
      var i = jsdate.getUTCMinutes() * 60
      var s = jsdate.getUTCSeconds()
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3)
    },
    g: function () {
      return f.G() % 12 || 12
    },
    G: function () {
      return jsdate.getHours()
    },
    h: function () {
      return _pad(f.g(), 2)
    },
    H: function () {
      return _pad(f.G(), 2)
    },
    i: function () {
      return _pad(jsdate.getMinutes(), 2)
    },
    s: function () {
      return _pad(jsdate.getSeconds(), 2)
    },
    u: function () {
      return _pad(jsdate.getMilliseconds() * 1000, 6)
    },
    e: function () {
      var msg = 'Not supported (see source code of date() for timezone on how to add support)'
      throw new Error(msg)
    },
    I: function () {
      var a = new Date(f.Y(), 0)
      var c = Date.UTC(f.Y(), 0)
      var b = new Date(f.Y(), 6)
      var d = Date.UTC(f.Y(), 6)
      return ((a - c) !== (b - d)) ? 1 : 0
    },
    O: function () {
      var tzo = jsdate.getTimezoneOffset()
      var a = Math.abs(tzo)
      return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4)
    },
    P: function () {
      var O = f.O()
      return (O.substr(0, 3) + ':' + O.substr(3, 2))
    },
    T: function () {
      // The following works, but requires inclusion of the very
      // large timezone_abbreviations_list() function.
      /*              var abbr, i, os, _default;
      if (!tal.length) {
        tal = that.timezone_abbreviations_list();
      }
      if ($locutus && $locutus.default_timezone) {
        _default = $locutus.default_timezone;
        for (abbr in tal) {
          for (i = 0; i < tal[abbr].length; i++) {
            if (tal[abbr][i].timezone_id === _default) {
              return abbr.toUpperCase();
            }
          }
        }
      }
      for (abbr in tal) {
        for (i = 0; i < tal[abbr].length; i++) {
          os = -jsdate.getTimezoneOffset() * 60;
          if (tal[abbr][i].offset === os) {
            return abbr.toUpperCase();
          }
        }
      }
      */
      return 'UTC'
    },
    Z: function () {
      return -jsdate.getTimezoneOffset() * 60
    },
    c: function () {
      return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb)
    },
    r: function () {
      return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb)
    },
    U: function () {
      return jsdate / 1000 | 0
    }
  }
  var _date = function (format, timestamp) {
    jsdate = (timestamp === undefined ? new Date() // Not provided
      : (timestamp instanceof Date) ? new Date(timestamp) // JS Date()
      : new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
    )
    return format.replace(formatChr, formatChrCb)
  }
  return _date(format, timestamp)
}
PHP.strtotime = function (text, now) {
  var parsed
  var match
  var today
  var year
  var date
  var days
  var ranges
  var len
  var times
  var regex
  var i
  var fail = false
  if (!text) {
    return fail
  }
  text = text.replace(/^\s+|\s+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/[\t\r\n]/g, '')
    .toLowerCase()
  var pattern = new RegExp([
    '^(\\d{1,4})',
    '([\\-\\.\\/:])',
    '(\\d{1,2})',
    '([\\-\\.\\/:])',
    '(\\d{1,4})',
    '(?:\\s(\\d{1,2}):(\\d{2})?:?(\\d{2})?)?',
    '(?:\\s([A-Z]+)?)?$'
  ].join(''))
  match = text.match(pattern)
  if (match && match[2] === match[4]) {
    if (match[1] > 1901) {
      switch (match[2]) {
        case '-':
          if (match[3] > 12 || match[5] > 31) {
            return fail
          }
          return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case '.':
          return fail
        case '/':
          if (match[3] > 12 || match[5] > 31) {
            return fail
          }
          return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
      }
    } else if (match[5] > 1901) {
      switch (match[2]) {
        case '-':
          // D-M-YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail
          }
          return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case '.':
          // D.M.YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail
          }
          return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case '/':
          // M/D/YYYY
          if (match[1] > 12 || match[3] > 31) {
            return fail
          }
          return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
      }
    } else {
      switch (match[2]) {
        case '-':
          // YY-M-D
          if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
            return fail
          }
          year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1]
          return new Date(year, parseInt(match[3], 10) - 1, match[5],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case '.':
          // D.M.YY or H.MM.SS
          if (match[5] >= 70) {
            // D.M.YY
            if (match[3] > 12 || match[1] > 31) {
              return fail
            }
            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
          }
          if (match[5] < 60 && !match[6]) {
            // H.MM.SS
            if (match[1] > 23 || match[3] > 59) {
              return fail
            }
            today = new Date()
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
            match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000
          }
          return fail
        case '/':
          if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
            return fail
          }
          year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5]
          return new Date(year, parseInt(match[1], 10) - 1, match[3],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case ':':
          // HH:MM:SS
          if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
            return fail
          }
          today = new Date()
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
          match[1] || 0, match[3] || 0, match[5] || 0) / 1000
      }
    }
  }
  if (text === 'now') {
    return now === null || isNaN(now)
      ? new Date().getTime() / 1000 | 0
      : now | 0
  }
  if (!isNaN(parsed = Date.parse(text))) {
    return parsed / 1000 | 0
  }
  pattern = new RegExp([
    '^([0-9]{4}-[0-9]{2}-[0-9]{2})',
    '[ t]',
    '([0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]+)?)',
    '([\\+-][0-9]{2}(:[0-9]{2})?|z)'
  ].join(''))
  match = text.match(pattern)
  if (match) {
    if (match[4] === 'z') {
      match[4] = 'Z'
    } else if (match[4].match(/^([+-][0-9]{2})$/)) {
      match[4] = match[4] + ':00'
    }
    if (!isNaN(parsed = Date.parse(match[1] + 'T' + match[2] + match[4]))) {
      return parsed / 1000 | 0
    }
  }
  date = now ? new Date(now * 1000) : new Date()
  days = {
    'sun': 0,
    'mon': 1,
    'tue': 2,
    'wed': 3,
    'thu': 4,
    'fri': 5,
    'sat': 6
  }
  ranges = {
    'yea': 'FullYear',
    'mon': 'Month',
    'day': 'Date',
    'hou': 'Hours',
    'min': 'Minutes',
    'sec': 'Seconds'
  }
  function lastNext (type, range, modifier) {
    var diff
    var day = days[range]
    if (typeof day !== 'undefined') {
      diff = day - date.getDay()
      if (diff === 0) {
        diff = 7 * modifier
      } else if (diff > 0 && type === 'last') {
        diff -= 7
      } else if (diff < 0 && type === 'next') {
        diff += 7
      }
      date.setDate(date.getDate() + diff)
    }
  }
  function process (val) {
    var splt = val.split(' ')
    var type = splt[0]
    var range = splt[1].substring(0, 3)
    var typeIsNumber = /\d+/.test(type)
    var ago = splt[2] === 'ago'
    var num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1)
    if (typeIsNumber) {
      num *= parseInt(type, 10)
    }
    if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
      return date['set' + ranges[range]](date['get' + ranges[range]]() + num)
    }
    if (range === 'wee') {
      return date.setDate(date.getDate() + (num * 7))
    }
    if (type === 'next' || type === 'last') {
      lastNext(type, range, num)
    } else if (!typeIsNumber) {
      return false
    }
    return true
  }
  times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
    '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
    '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)'
  regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?'
  match = text.match(new RegExp(regex, 'gi'))
  if (!match) {
    return fail
  }
  for (i = 0, len = match.length; i < len; i++) {
    if (!process(match[i])) {
      return fail
    }
  }
  return (date.getTime() / 1000)
}
PHP.print_r = function(array, returnVal) { 
  var output = ''
  var padChar = ' '
  var padVal = 4
  var _repeatChar = function (len, padChar) {
    var str = ''
    for (var i = 0; i < len; i++) {
      str += padChar
    }
    return str
  }
  var _formatArray = function (obj, curDepth, padVal, padChar) {
    if (curDepth > 0) {
      curDepth++
    }
    var basePad = _repeatChar(padVal * curDepth, padChar)
    var thickPad = _repeatChar(padVal * (curDepth + 1), padChar)
    var str = ''
    if (typeof obj === 'object' &&
      obj !== null &&
      obj.constructor) {
      str += 'Array\n' + basePad + '(\n'
      for (var key in obj) {
        if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
          str += thickPad
          str += '['
          str += key
          str += '] => '
          str += _formatArray(obj[key], curDepth + 1, padVal, padChar)
        } else {
          str += thickPad
          str += '['
          str += key
          str += '] => '
          str += obj[key]
          str += '\n'
        }
      }
      str += basePad + ')\n'
    } else if (obj === null || obj === undefined) {
      str = ''
    } else {
      // for our "resource" class
      str = obj.toString()
    }
    return str
  }
  output = _formatArray(array, 0, padVal, padChar)
  if (returnVal !== true) {
    PHP.echo(output)
    return true
  }
  return output
}
PHP.join = function(glue, pieces) {

  return PHP.implode(glue, pieces)
}
PHP.lcfirst = function(str) {
  str += ''
  var f = str.charAt(0)
    .toLowerCase()
  return f + str.substr(1)
}
PHP.rtrim = function(str, charlist){  
  charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
    .replace(/([[\]().?/*{}+$^:])/g, '\\$1')
  var re = new RegExp('[' + charlist + ']+$', 'g')
  return (str + '').replace(re, '')
}
PHP.strip_tags = function(input, allowed) { 
  allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
  var before = input
  var after = input
  // recursively remove tags to ensure that the returned string doesn't contain forbidden tags after previous passes (e.g. '<<bait/>switch/>')
  while (true) {
    before = after
    after = before.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
    })
    // return once no more tags are removed
    if (before === after) {
      return after
    }
  }
}
window.PHP = PHP;
// END PHP JS LIBRARY

