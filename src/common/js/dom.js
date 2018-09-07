export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let arr = el.className.split(' ')
  arr.push(className)
  el.className = arr.join('')
}
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
export function attr(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

// 获取一个div的style，通过这个来判断浏览器支持哪个特性
const elementStyle = document.createElement('div').style
// 获取一下浏览器厂商
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    Ms: 'MsTransform',
    O: 'OTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== 'undefined') {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
