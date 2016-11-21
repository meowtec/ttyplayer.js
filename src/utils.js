const hasOwnProperty = Object.prototype.hasOwnProperty
const toString = Object.prototype.toString

export function isArray(arr) {
  return toString.call(arr) === '[object Array]'
}

export function isString(str) {
  return typeof str === 'string'
}

export function assign(a, b) {
  for (let key in b) {
    if (hasOwnProperty.call(b, key)) {
      a[key] = b[key]
    }
  }

  return a
}

/**
 * @param {ArrayBuffer} arrayBuffer
 * @param {number} start
 * @param {number} length
 */
export function readUtf8(arrayBuffer, start, length) {
  return decodeURIComponent(escape(String.fromCharCode.apply(
    null, new Uint8Array(arrayBuffer, start, length)
  )))
}

/**
 * @param {string} url
 * @param {function} callback
 */
export function fetchArrayBuffer(url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'arraybuffer'
  xhr.send()
  const error = new Error('XMLHttpRequest error.')
  xhr.onload = _ => {
    if (!/^2/.test(xhr.status)) {
      return callback(error)
    }
    callback(null, xhr.response)
  }
  xhr.onerror = _ => callback(error)
}

const div = document.createElement('div')
export function element(template) {
  div.innerHTML = template

  const refsElement = div.querySelectorAll('[ref]')
  const refs = {}

  for (let i = 0, len = refsElement.length; i < len; i++) {
    let node = refsElement[i]
    let ref = node.getAttribute('ref')
    node.removeAttribute('ref')
    refs[ref] = node
  }

  return {
    refs,
    element: div.children[0]
  }
}

/**
 * @param {Element} el
 * @param {function(Element): boolean} cond
 */
export function closet(el, cond) {
  let elem = el

  while (elem && elem !== document) {
    if (cond(elem)) {
      return elem
    }

    elem = elem.parentNode
  }
}

export function replaceTpl(str, data) {
  let html = str
  for (let key in data) {
    if (hasOwnProperty.call(data, key)) {
      let value = data[key]
      if (value == null) {
        value = ''
      }
      html = html.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), value)
    }
  }
  return html
}
