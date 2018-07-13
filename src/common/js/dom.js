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
