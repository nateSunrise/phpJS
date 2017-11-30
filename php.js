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
// END PHP JS LIBRARY

