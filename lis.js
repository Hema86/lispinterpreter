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
  },
  'pi': 3.142
}
function evaluater (input) {
  if (numberParser(input) !== null) return numberParser(input)
  if (input.startsWith('(')) {
    input = input.slice(1)
    let fn = identifier(input)
    if (fn in env) return sExpression(input)
    else return specialForm(input)
  }
}
function sExpression (input) {
  let fn = identifier(input)
  input = input.slice(fn.length)
  input = spaceParser(input)
  let args = []
  while (!input.startsWith(')')) {
    if (input.startsWith('(')) {
      input = input.slice(1)
      let result = sExpression(input)
      args.push(result)
      input = input.slice(input.indexOf(')') + 1)
      input = spaceParser(input)
    } else {
      let val = identifier(input)
      if (val in env) {
        args.push(env[val])
        input = input.slice(val.length)
        input = spaceParser(input)
      } else {
        let result = evaluater(input)
        if (result !== null) { args.push(result) }
        input = input.slice(1)
        input = spaceParser(input)
      }
    }
  }
  return env[fn](args)
}
function specialForm (input) {
  if (input.startsWith('if')) return parserForIf(input)
  if (input.startsWith('define')) return parserForDef(input)
  if (input.startsWith('begin')) return parserForBegin(input)
  if (input.startsWith('\'') || input.startsWith('quote')) return parserForQuote(input)
  if (input.startsWith('lambda')) return parserForLambda(input)
}
function parserForIf (input) {
  input = input.slice(2)
  input = spaceParser(input)
  let test = input.substring(0, input.indexOf(')') + 1)
  input = input.slice(input.indexOf(')') + 1)
  input = spaceParser(input)
  let conseq
  if (input.startsWith('(')) {
    conseq = input.substring(0, input.indexOf(')') + 1)
    input = input.slice(input.indexOf(')') + 1)
  } else {
    conseq = input.substring(0, input.indexOf(' '))
    input = input.slice(input.indexOf(' ') + 1)
  }
  input = spaceParser(input)
  let alt
  if (input.startsWith('(')) {
    alt = input.substring(0, input.indexOf(')') + 1)
    input = input.slice(input.indexOf(')') + 1)
  } else {
    alt = input.substring(0, input.indexOf(')'))
    input = input.slice(input.indexOf(' ') + 1)
  }
  input = spaceParser(input)
  if (evaluater(test)) return evaluater(conseq)
  else return evaluater(alt)
}
function parserForDef (input) {
  input = input.slice(6)
  input = spaceParser(input)
  let key
  if (input.startsWith('(')) {
    key = evaluater(input)
    input = input.slice(input.indexOf(')') + 1)
  } else {
    key = input.substring(0, input.indexOf(' '))
    input = input.slice(input.indexOf(' '))
  }
  input = spaceParser(input)
  let val = input.substring(0, input.indexOf(')') + 1)
  val = evaluater(val)
  env[key] = val
  return 'prop added'
}
function parserForBegin (input) {
  input = input.slice(6)
  let defCheck = input.substring(0, input.indexOf(')') + 1)
  evaluater(defCheck)
  input = input.slice(defCheck.length)
  input = spaceParser(input)
  return evaluater(input)
}
function parserForQuote (input) {
  if (input.startsWith('\'')) {
    input = input.slice(1)
  }
  if (input.startsWith('quote')) {
    input = input.slice(5)
  }
  input = spaceParser(input)
  return input.substring(0, input.length - 1)
}
function parserForLambda (input) {
  input = input.slice(6)
  input = spaceParser(input)
  let symbol = input.substring(0, input.indexOf(')') + 1)
  input = input.slice(symbol.length)
  input = spaceParser(input)
  return evaluater(input)
}
function identifier (str) {
  let regEx = /^[^\\)\s]+/
  let result = regEx.exec(str)
  return result[0].replace(' ', '')
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
let res = evaluater('(if (> 10 20) (+ 1 1) (+ 3 3))')
console.log(res)
let res1 = evaluater('(begin (define r 10) (* pi (* r r)))')
console.log(res1)
let res2 = evaluater('(+ (+ x x) (* x x))')
console.log(res2)
let res3 = evaluater('(define (define g 4) 4)')
console.log(res3)
let res4 = evaluater('(quote (+ 1 2))')
console.log(res4)
let res5 = evaluater('(lambda (r) (* pi (* r r)))')
console.log(res5)
let res6 = evaluater('(define r (* 6 7))')
console.log(res6)
