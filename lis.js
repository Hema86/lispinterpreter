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
  // console.log(result)
  if (result !== null) return result
  str = spaceParser(str)
  if (str.startsWith('(')) {
    str = str.slice(1)
    if (str.startsWith('+')) {
      str = str.slice(1)
      str = str.substring(0, str.indexOf(')'))
      str = spaceParser(str)
      let valArr = str.split(' ')
      return env['+'](valArr)
    }
    if (str.startsWith('-')) {
      str = str.slice(1)
      str = str.substring(0, str.indexOf(')'))
      str = spaceParser(str)
      let valArr = str.split(' ')
      return env['-'](valArr)
    }
    if (str.startsWith('*')) {
      str = str.slice(1)
      str = str.substring(0, str.indexOf(')'))
      str = spaceParser(str)
      let valArr = str.split(' ')
      return env['*'](valArr)
    }
    if (str.startsWith('/')) {
      str = str.slice(1)
      str = str.substring(0, str.indexOf(')'))
      str = spaceParser(str)
      let valArr = str.split(' ')
      return env['/'](valArr)
    }
    if (str.startsWith('%')) {
      str = str.slice(1)
      str = str.substring(0, str.indexOf(')'))
      str = spaceParser(str)
      let valArr = str.split(' ')
      return env['%'](valArr)
    }
    if (str.startsWith('=')) {
      str = spaceParser(str)
      str = str.slice(1)
      str = spaceParser(str)
      let valArr = str.split(' ')
      str = spaceParser(str)
      return env['='](valArr)
    }
    if (str.startsWith('>')) {
      str = spaceParser(str)
      str = str.slice(1)
      str = spaceParser(str)
      let valArr = str.split(' ')
      return env['>'](valArr)
    }
    if (str.startsWith('<')) {
      str = spaceParser(str)
      str = str.slice(1)
      str = spaceParser(str)
      let valArr = str.split(' ')
      return env['<'](valArr)
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
// let result = evaluater('define x 4')
let res = evaluater('(+ 1 4)')
console.log(res)
