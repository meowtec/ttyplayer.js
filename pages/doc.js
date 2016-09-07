;(function() {

var term = new TTYPlayer.Terminal({
  parent: document.getElementById('header'),
  cols: 60,
  rows: 20
})
term.open()

var text = `\u001b[32mTTYPlayer\u001b[39m

Play back \u001b[35mtty\u001b[39m recorded data in browser.
Easy to embed in your \u001b[35mblog\u001b[39m such as \u001b[33mjekyll\u001b[39m and \u001b[32mGhost\u001b[39m.


Scroll down to learn more...`.replace(/\n\r?/g, '\n\r')
var escapeChar = '\u001b'

function getEscape(text, index) {
  var x = text.slice(index, index + 8)
  var matched = x.match(/\u001b\[\d+m/)
  if (matched) {
    return matched[0]
  }
  return escapeChar
}

function getChars(text, index) {
  var char = text.charAt(index)
  if (char === '\n') {
    return '\n\r'
  } else if (char === '\u001b') {
    return getEscape(text, index)
  } else {
    return char
  }
}

var textlength = text.length
function type(text, i) {
  var chars = getChars(text, i)

  term.write(chars)
  var nextIndex = i + chars.length
  if (nextIndex < textlength) {
    setTimeout(function() {
      type(text, nextIndex)
    }, 80 + Math.random() * 50)
  } else {
    setTimeout(function() {
      term.reset()
      type(text, 0)
    }, 3000)
  }
}

type(text, 0)

})()
