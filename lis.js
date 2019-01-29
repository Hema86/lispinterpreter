'use strict'
function numberParser (str) {
  let regEx = /^-?(0|[\d1-9]\d*)(\.\d+)?(?:[Ee][+-]?\d+)?/
  let value = str.match(regEx)
  if (value !== null) return [value[0] * 1, str.slice(value[0].length)]
  else return null
}
function spaceParser (str) {
  let regex = /^\s+/
  str = str.replace(regex, '')
  return str
}
function inputParser (str) {
  str = spaceParser(str)
  let result = numberParser(str)
  // console.log(result)
  if (result !== null) return result
  str = spaceParser(str)
  if (str.startsWith('if')) {
    str = str.slice(2)
    str = spaceParser(str)
    let test = str.substring(1, str.indexOf(')') + 1)
    str = str.slice(test.length + 1)
    str = spaceParser(str)
    let conseq = str.substring(0, str.indexOf(' '))
    str = str.slice(conseq.length)
    str = spaceParser(str)
    let alt = str.substring(0, str.indexOf(' ') + 1)
    if (test.startsWith('=')) return equalCheck(test.slice(1, test.length - 1), conseq, alt)
    if (test.startsWith('>')) return greater(test.slice(1, test.length - 1), conseq, alt)
    if (test.startsWith('<')) return lesser(test.slice(1, test.length - 1), conseq, alt)
  }
  if (str.startsWith('(+')) {
    str = str.slice(2)
    str = str.substring(0, str.indexOf(')'))
    return add(str)
  }
  if (str.startsWith('(-')) {
    str = str.slice(2)
    str = str.substring(0, str.indexOf(')'))
    return sub(str)
  }
  if (str.startsWith('(*')) {
    str = str.slice(2)
    str = str.substring(0, str.indexOf(')'))
    return mul(str)
  }
  if (str.startsWith('(/')) {
    str = str.slice(2)
    str = str.substring(0, str.indexOf(')'))
    return div(str)
  }
  if (str.startsWith('(%')) {
    str = str.slice(2)
    str = str.substring(0, str.indexOf(')'))
    return mod(str)
  }
}
function equalCheck (values, success, fail) {
  values = spaceParser(values)
  let valArr = values.split(' ')
  if (valArr[0] === valArr[1]) return success
  else return fail
}
function greater (values, success, fail) {
  values = spaceParser(values)
  let valArr = values.split(' ')
  if (valArr[0] > valArr[1]) return success
  else return fail
}
function lesser (values, success, fail) {
  values = spaceParser(values)
  let valArr = values.split(' ')
  if (valArr[0] < valArr[1]) return success
  else return fail
}
function add (inputs) {
  inputs = spaceParser(inputs)
  let valArr = inputs.split(' ')
  return valArr[0] * 1 + valArr[1] * 1
}
function sub (inputs) {
  inputs = spaceParser(inputs)
  let valArr = inputs.split(' ')
  return valArr[0] * 1 - valArr[1] * 1
}
function mul (inputs) {
  inputs = spaceParser(inputs)
  let valArr = inputs.split(' ')
  return valArr[0] * 1 * valArr[1] * 1
}
function div (inputs) {
  inputs = spaceParser(inputs)
  let valArr = inputs.split(' ')
  return valArr[0] * 1 / valArr[1] * 1
}
function mod (inputs) {
  inputs = spaceParser(inputs)
  let valArr = inputs.split(' ')
  return valArr[0] * 1 % valArr[1] * 1
}
let result = inputParser('(+ 4 3)')
console.log(result)
