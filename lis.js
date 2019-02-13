'use strict'
let ENV = {
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
  '<=': (valArr) => {
    return valArr.reduce((a, b) => {
      return a * 1 <= b * 1
    })
  },
  '>=': (valArr) => {
    return valArr.reduce((a, b) => {
      return a * 1 <= b * 1
    })
  },
  'pi': 3.142
}
let current = ENV
function evaluater (input) {
  if (numberParser(input) !== null) return numberParser(input)
  if (input.startsWith('(')) {
    input = input.slice(1)
    let fn = identifier(input)
    if (fn in current) return sExpression(input)
    if (current['parent'] !== undefined) {
      if (fn in current['parent']) return sExpression(input)
    }
    if (current['args'] !== undefined) {
      return sExpression(input)
    } else return specialForm(input)
  }
  if (strParser(input) !== null) return strParser(input)
}

function sExpression (input) {
  let fn = identifier(input)
  if (typeof (current[fn]) === 'object') return procedure(input)
  // current = current['parent']
  input = input.slice(fn.length)
  input = spaceParser(input)
  let args = []
  while (!input.startsWith(')')) {
    if (input.startsWith('(')) {
      input = input.slice(1)
      let result = sExpression(input)
      args.push(result[0])
      input = spaceParser(result[1])
    } else {
      let val = identifier(input)
      if (val in current) {
        args.push(current[val])
        input = input.slice(val.length)
        input = spaceParser(input)
      } else if (current['args'] !== undefined) {
        if (val in current['args']) {
          args.push(current['args'][val])
          input = input.slice(val.length)
          input = spaceParser(input)
        }
      } else {
        let result = evaluater(input)
        if (result !== null) { args.push(result[0]) }
        result = result[0].toString()
        input = input.slice(result.length)
        input = spaceParser(input)
      }
    }
  } current = ENV
  return [current[fn](args), spaceParser(input.slice(1))]
}
function specialForm (input) {
  if (input.startsWith('if')) return parserIf(input)
  if (input.startsWith('define')) return parserDef(input)
  if (input.startsWith('begin')) return parserBegin(input)
  if (input.startsWith('\'') || input.startsWith('quote')) return parserQuote(input)
  if (input.startsWith('lambda')) return parserLambda(input)
}
function parserIf (input) {
  input = input.slice(2)
  input = spaceParser(input)
  let result = evaluater(input)
  let conseq = evaluater(result[1])
  if (conseq[1].startsWith(')')) return 'Invalid expression'
  let alt = evaluater(conseq[1])
  if (result[0] === true) return conseq[0]
  else return alt[0]
}

function parserDef (input) {
  input = input.slice(6)
  input = spaceParser(input)
  let result = evaluater(input)
  let key = result[0]
  input = spaceParser(result[1])
  let val = evaluater(input)
  current[key] = val[0]
  // current = current[key]['env']
  return 'prop added'
}
function parserBegin (input) {
  input = input.slice(6)
  let defCheck = input.substring(0, input.indexOf(')') + 1)
  evaluater(defCheck)
  input = input.slice(defCheck.length + 1)
  input = spaceParser(input)
  let result = evaluater(input)
  return result[0]
}
function parserQuote (input) {
  if (input.startsWith('\'')) {
    input = input.slice(1)
  }
  if (input.startsWith('quote')) {
    input = input.slice(5)
  }
  input = spaceParser(input)
  return input.substring(0, input.length - 1)
}
function parserLambda (input) {
  input = input.slice(6)
  input = spaceParser(input)
  let result = {}
  result['env'] = {}
  result['env']['parent'] = ENV
  result['env']['args'] = {}
  if (input.startsWith('(')) input = input.slice(1)
  while (!input.startsWith(')')) {
    result['env']['args'][input.substring(0, 1)] = null
    input = input.slice(1)
    input = spaceParser(input)
  }
  input = input.slice(1)
  input = spaceParser(input)
  result['env']['eval'] = input.substring(0, input.indexOf(')') + 1)
  // console.log(result)
  return [result, input.slice(result['env']['eval'])]
}
function identifier (str) {
  let regEx = /^[^\\)\s]+/
  let result = regEx.exec(str)
  return result[0].replace(' ', '')
}
function numberParser (str) {
  let regEx = /^-?(0|[\d1-9]\d*)(\.\d+)?(?:[Ee][+-]?\d+)?/
  let value = str.match(regEx)
  if (value !== null) return [value[0] * 1, str.slice(value[0].length, str.length)]
  else return null
}
function strParser (str) {
  let regEx = /^[A-Za-z]+/
  let value = str.match(regEx)
  if (value !== null) return [value[0], str.slice(value[0].length, str.length)]
  else return null
}
function spaceParser (str) {
  let regex = /^\s+/
  str = str.replace(regex, '')
  return str
}
function procedure (input) {
  let fn = identifier(input)
  // current = current['env']
  input = input.slice(fn.length)
  input = spaceParser(input)
  while (!input.startsWith(')')) {
    let result = evaluater(input)
    for (let key in current[fn]['env']['args']) {
      current[fn]['env']['args'][key] = result[0]
    }
    result = result[0].toString()
    input = input.slice(result.length)
    input = spaceParser(input)
  }
  current = current[fn]['env']
  let result = evaluater(current['eval'])
  return result[0]
}

function repl () {
  var stdin = process.openStdin()
  stdin.addListener('data', function (input) {
    let res = evaluater(input.toString().trim(), null)
    if (res !== null) console.log(JSON.stringify(res))
  })
}
repl()
