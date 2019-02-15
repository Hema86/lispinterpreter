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
  'pi': 3.142,
  'lambda': function evalLambda (obj) {
    let result = evaluater(obj['eval'])
    // console.log(result)
    return result
  },
  'cons': function addElement (arr) {
    arr[1].unshift(arr[0])
    return arr[1]
  }
}
let current = ENV
function evaluater (input) {
  if (numberParser(input) !== null) return numberParser(input)
  if (input.startsWith('(')) {
    input = input.slice(1)
    if (input.startsWith('(')) return evaluater(input)
    let fn = identifier(input)
    if (fn in current) {
      if (fn === 'lambda') return parserLambda(input)
      else return sExpression(input)
    }
    if (current['parent'] === undefined) return specialForm(input)
    if (fn in current['parent']) return sExpression(input)
    if (fn in current['args']) return sExpression(input)
    else return specialForm(input)
  }
  if (strParser(input) !== null) return strParser(input)
}

function sExpression (input) {
  let fn = identifier(input)
  input = input.slice(fn.length)
  input = spaceParser(input)
  let args = []
  while (!input.startsWith(')')) {
    if (input.startsWith('(')) {
      // input = input.slice(1)
      let result = evaluater(input)
      if (!Array.isArray(result)) {
        args.push(result)
        break
      }
      if (typeof result[1] !== 'string') {
        args.push(result)
        break
      }
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
        } else if (current['parent'] !== undefined) {
          if (val in current['parent']) {
            args.push(current['parent'][val])
            input = input.slice(val.length)
            input = spaceParser(input)
          } else {
            let result = evaluater(input)
            if (result !== null) { args.push(result[0]) }
            result = result[0].toString()
            input = input.slice(result.length)
            input = spaceParser(input)
          }
        }
      } else {
        let result = evaluater(input)
        if (result !== null) { args.push(result[0]) }
        result = result[0].toString()
        input = input.slice(result.length)
        input = spaceParser(input)
      }
    }
  } if (fn in ENV && (typeof (ENV[fn]) === 'object')) return valueAssigner(fn + ' ' + args.join(' ') + ')')
  else if (current !== ENV) return [current['parent'][fn](args), spaceParser(input.slice(1))]
  else return [current[fn](args), spaceParser(input.slice(1))]
}

function specialForm (input) {
  if (input.startsWith('if')) return parserIf(input)
  if (input.startsWith('define')) return parserDef(input)
  if (input.startsWith('begin')) return parserBegin(input)
  if (input.startsWith('\'') || input.startsWith('quote')) return parserQuote(input)
  if (input.startsWith('list')) return parserList(input)
}

function parserIf (input) {
  input = input.slice(2)
  input = spaceParser(input)
  let result = evaluater(input)
  let conseq = evaluater(result[1])
  if (conseq[1].startsWith(')')) return 'Invalid expression'
  if (result[0] === true) return conseq[0]
  else {
    let alt = evaluater(spaceParser(conseq[1]))
    return alt[0]
  }
}

function parserDef (input) {
  current = ENV
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
    input = spaceParser(input)
    let result = input.substring(0, input.indexOf(')'))
    if (result.startsWith('[') && result.endsWith(']')) {
      let itsArray = []
      return [itsArray, input.slice(result.length + 1)]
    }
    return [result, input.slice(result.length + 1)]
  }
}

let array = []
function parserList (input) {
  let fn = identifier(input)
  input = input.slice(fn.length)
  input = spaceParser(input)
  while (!input.startsWith(')')) {
    let result = evaluater(input)
    array.push(result[0])
    input = spaceParser(result[1])
    // input = spaceParser(input)
  }
  return array
}

function parserLambda (input) {
  input = input.slice(6)
  input = spaceParser(input)
  let result = {}
  result['type'] = 'lambda'
  result['env'] = {}
  result['env']['parent'] = ENV
  result['env']['args'] = {}
  if (input.startsWith('(')) input = input.slice(1)
  while (!input.startsWith(')')) {
    let arg = evaluater(input)
    result['env']['args'][arg[0]] = null
    input = input.slice(arg[0].length)
    input = spaceParser(input)
  }
  input = input.slice(1)
  input = spaceParser(input)
  result['env']['eval'] = input
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

function valueAssigner (input) {
  let fn = identifier(input)
  current = ENV
  current = current[fn]['env']
  // current = current['env']
  input = input.slice(fn.length)
  input = spaceParser(input)
  while (!input.startsWith(')')) {
    for (let key in current['args']) {
      let result = evaluater(input)
      current['args'][key] = result[0]
      result = result[0].toString()
      input = input.slice(result.length)
      input = spaceParser(input)
    }
  }
  return ENV['lambda'](current)
}

function repl () {
  var stdin = process.openStdin()
  stdin.addListener('data', function (input) {
    let res = evaluater(input.toString().trim(), null)
    if (res !== null) console.log(JSON.stringify(res))
  })
}
repl()
