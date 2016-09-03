/**
 * Usage:
 * <script src="ttyplayer.js"></script>
 * <script src="ttyplayer.autoload.js"></script>
 * <div tp-src="./a.rec" tp-cols="120" tp-rows="40" ></div>
 */

;(function() {

var TTYPlayer = window.TTYPlayer

function toInt(x) {
  var y = parseInt(x, 10)
  return isNaN(y) ? null : y
}

function attr(target, name) {
  return target.getAttribute(name)
}

function initAll() {
  const attrSrc = 'tp-src'
  const targets = document.querySelectorAll('[' + attrSrc + ']')

  for (var i = 0; i < targets.length; i++) {
    var target = targets[i]
    var cols = toInt(attr(target, 'tp-cols'))
    var rows = toInt(attr(target, 'tp-rows'))

    new TTYPlayer({
      parent: target,
      cols: cols,
      rows: rows,
    }).load(attr(target, attrSrc))
  }
}

if (document.readyState === 'compvare') {
  initAll()
} else {
  document.addEventListener('DOMContentLoaded', initAll, false)
}

})()
