;(function() {

var TTYPlayer = window.TTYPlayer

function toInt(x) {
  var y = parseInt(x, 10)
  return isNaN(y) ? null : y
}

function attr(target, name) {
  return target.getAttribute(name)
}

function parseCodeBlock(src) {
  var options = {}
  src.split('\n').forEach(function(line) {
    var mathded = line.trim().match(/^(\w+)\s*:\s*(.*)$/)
    if (!mathded) return
    options[mathded[1]] = mathded[2]
  })
  return options
}

function each(arrayLike, fun) {
  for (var i = 0, len = arrayLike.length; i < len; i++) {
    fun(arrayLike[i], i)
  }
}

function initAll() {
  var attrSrc = 'tp-src'

  /**
   * <div tp-src="./a.rec" tp-cols="120" tp-rows="40" ></div>
   */
  each(document.querySelectorAll('[' + attrSrc + ']'), function(target) {
    var cols = toInt(attr(target, 'tp-cols'))
    var rows = toInt(attr(target, 'tp-rows'))

    new TTYPlayer({
      parent: target,
      cols: cols,
      rows: rows,
    }).load(attr(target, attrSrc))
  })

  /**
   * ```tty
   * src: path/to/your.rec
   * ```
   */
  each(document.querySelectorAll('.language-tty'), function(codeBlock) {
    var pre = codeBlock.parentNode
    var doc = pre.parentNode
    if (pre.tagName.toUpperCase() !== 'PRE') return

    var options = parseCodeBlock(codeBlock.textContent)
    var p = document.createElement('p')
    doc.insertBefore(p, pre)
    pre.style.display = 'none'
    new TTYPlayer({
      parent: p,
      cols: toInt(options.cols),
      rows: toInt(options.rows),
    }).load(options.src)
  })
}

if (document.readyState === 'compvare') {
  initAll()
} else {
  document.addEventListener('DOMContentLoaded', initAll, false)
}

})()
