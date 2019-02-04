'use strict'
let env = {
  '+': (valArr) => {
    return valArr.reduce((a, b) => {
      return a * 1 + b * 1
    })
  },
  '-': (valArr) => {
    return valArr.reduce((a, b) => {
      return a * 1 - b * 1
    })
  },
  '*': (valArr) => {
    return valArr.reduce((a, b) => {
      return a * 1 * b * 1
    })
  },
  '/': (valArr) => {
    return valArr.reduce((a, b) => {
      return a * 1 / b * 1
    })
  },
  '%': (valArr) => {
    return valArr.reduce((a, b) => {
      return a * 1 % b * 1
    })
  },
  '=': (valArr) => {
    return valArr.reduce((a, b) => {
      return a * 1 === b * 1
    })
  },
  '>': (valArr) => {
    return valArr.reduce((a, b) => {
      return a * 1 > b * 1
    })
  },
  '<': (valArr) => {
    return valArr.reduce((a, b) => {
      return a * 1 < b * 1
    })
  }
}
function evaluater (str) {
  str = spaceParser(str)
  let result = numberParser(str)
  if (result !== null) return result
  str = spaceParser(str)
  if (str.startsWith('(')) {
    str = str.slice(1)
    if (str.startsWith('+')) {
      if ('+' in env) {
        let operandsArr = findOperands(str)
        return env['+'](operandsArr)
      }
    }
    if (str.startsWith('-')) {
      if ('-' in env) {
        let operandsArr = findOperands(str)
        return env['-'](operandsArr)
      }
    }
    if (str.startsWith('*')) {
      if ('*' in env) {
        let operandsArr = findOperands(str)
        return env['*'](operandsArr)
      }
    }
    if (str.startsWith('/')) {
      if ('/' in env) {
        let operandsArr = findOperands(str)
        return env['/'](operandsArr)
      }
    }
    if (str.startsWith('%')) {
      if ('%' in env) {
        let operandsArr = findOperands(str)
        return env['%'](operandsArr)
      }
    }
    if (str.startsWith('=')) {
      if ('=' in env) {
        let operandsArr = findOperands(str)
        return env['='](operandsArr)
      }
    }
    if (str.startsWith('>')) {
      if ('>' in env) {
        let operandsArr = findOperands(str)
        return env['>'](operandsArr)
      }
    }
    if (str.startsWith('<')) {
      if ('<' in env) {
        let operandsArr = findOperands(str)
        return env['<'](operandsArr)
      }
    }

    if (str.startsWith('if')) {
      str = str.slice(2)
      str = spaceParser(str)
      let test = str.substring(0, str.indexOf(')'))
      str = str.slice(test.length + 1)
      str = spaceParser(str)
      let conseq = str.substring(0, str.indexOf(' '))
      str = str.slice(conseq.length)
      str = spaceParser(str)
      let alt = str.substring(0)
      str = str.slice(alt.length)
      str = spaceParser(str)
      if (evaluater(test)) result = evaluater(conseq)
      else result = evaluater(alt)
      return result
    }
    if (str.startsWith('define')) {
      str = str.slice(6)
      str = spaceParser(str)
      let key = str.substring(0, str.indexOf(' '))
      str = str.slice(1)
      str = spaceParser(str)
      let val = str * 1
      env[key] = val
    }
    if (str.startsWith('begin')) {
      str = str.slice(6)
      str = spaceParser(str)
      let def = str.substring(0, str.indexOf(')') + 1)
      evaluater(def)
      str = str.slice(def.length)
      str = spaceParser(str)
      return evaluater(str)
    }
    // if (str.startsWith('quote')) {
    //   str = str.slice(6)
    //   str = spaceParser(str)
    // }
    // if (str.startsWith('set')) {
    // }
  }
}
function findOperands (str) {
  str = str.slice(1)
  str = spaceParser(str)
  if (str.endsWith(')')) {
    str = str.substring(0, str.indexOf(')'))
    str = spaceParser(str)
    return str.split(' ')
  }
  return str.split(' ')
}

function numberParser (str) {
  let regEx = /^-?(0|[\d1-9]\d*)(\.\d+)?(?:[Ee][+-]?\d+)?/
  let value = str.match(regEx)
  if (value !== null) return value[0] * 1
  else return null
}
function spaceParser (str) {
  let regex = /^\s+/
  str = str.replace(regex, '')
  return str
}
let result = evaluater('(begin (define x 8)')
console.log(result)
// let res = evaluater('(* 1 2)')
// console.log(res)
let res1 = evaluater('(if (= 1 6) 5 6)')
console.log(res1)
