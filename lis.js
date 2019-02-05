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
function evaluater (input) {
  if (input.startsWith('(')) {
    input = input.slice(1)
    let fn = fnParser(input)
    if (fn in env) {
      input = input.slice(fn.length)
      input = spaceParser(input)
      let args = []
      while (!input.startsWith(')')) {
        if (input.startsWith('(')) {
          let result = evaluater(input)
          args.push(result)
          input = input.slice(input.indexOf(')') + 1)
          input = spaceParser(input)
        } else {
          let result = numberParser(input)
          if (result !== null) { args.push(result) }
          input = input.slice(1)
          input = spaceParser(input)
        }
      }
      return env[fn](args)
    } else {
      if (fn === 'if') {
        input = input.slice(fn.length)
        input = spaceParser(input)
        let test = input.substring(0, input.indexOf(')') + 1)
        input = input.slice(input.indexOf(')') + 1)
        input = spaceParser(input)
        let conseq = input.substring(0, input.indexOf(')') + 1)
        input = input.slice(input.indexOf(')') + 1)
        input = spaceParser(input)
        let alt = input.substring(0, input.indexOf(')') + 1)
        input = input.slice(input.indexOf(')') + 1)
        input = spaceParser(input)
        if (evaluater(test)) return evaluater(conseq)
        else return evaluater(alt)
      }
      if (fn === 'define') {
        input = input.slice(fn.length)
        input = spaceParser(input)
        let key = input.substring(0, input.indexOf(' '))
        input = input.slice(input.indexOf(' '))
        input = spaceParser(input)
        let val = input.substring(0, input.indexOf(')'))
        env[key] = val * 1
        return 'new property to env'
      }
    }
  }
}
function fnParser (str) {
  return str.slice(0, str.indexOf(' '))
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
let result = evaluater('(define x 8)')
console.log(result)
let res = evaluater('(if (= 2 5) (* 2 2) (/ 2 2))')
console.log(res)
// let res1 = sexpression('(+ (+ 1 4) (* 3 2))')
// console.log(res1)
