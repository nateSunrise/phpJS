// PHP JS LIBRARY

function PHP(){}
PHP.map      = function(array,multiple){
	if(typeof multiple === 'undefined') return false;
	if(array.length <= 0) return false
	for(var i = 0 ; i < array.length ; i++){
		array[i] *= multiple;
	}
	return array;
}

PHP.is_bool  = function(bool){
	return (bool === true || bool === false);
}
PHP.is_json   = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
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
PHP.in_array = function(){
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


// END PHP JS LIBRARY

