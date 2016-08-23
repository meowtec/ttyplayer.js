'use strict'

var hasOwnProperty = Object.prototype.hasOwnProperty
var toString = Object.prototype.toString

exports.assign =  function assign(a, b) {
  for (var key in b) {
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
exports.readUtf8 = function readUtf8(arrayBuffer, start, length) {
  return decodeURIComponent(escape(String.fromCharCode.apply(
    null, new Uint8Array(arrayBuffer, start, length)
  )))
}

/**
 * @param {string} url
 * @param {function} callback
 */
exports.fetchArrayBuffer = function fetchArrayBuffer(url, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'arraybuffer'
  xhr.send()
  var error = new Error('XMLHttpRequest error.')
  xhr.onload = function() {
    if (!/^2/.test(xhr.status)) {
      return callback(error)
    }
    callback(null, xhr.response)
  }
  xhr.onerror = function() {
    callback(error)
  }
}

function isArray(arr) {
  return toString.call(arr) === '[object Array]'
}

function isString(str) {
  return typeof str === 'string'
}

exports.e =
exports.element = function(tagName, className, children) {
  var element = document.createElement(tagName)
  element.className = className

  if (isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      element.appendChild(children[i])
    }
  } else if (isString(children)) {
    element.textContent = element.innerText = children
  }

  return element
}
