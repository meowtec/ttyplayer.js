;(function() {
  var Terminal = require('../libs/xterm.js')
  var EventEmitter = Terminal.EventEmitter
  var inherits = Terminal.inherits

  var hasOwnProperty = Object.prototype.hasOwnProperty

  var defaultCols = 80
  var defaultRows = 30

  function extend(a, b) {
    for (var key in b) {
      if (hasOwnProperty.call(b, key)) {
        a[key] = b[key]
      }
    }
  }

  /**
   * @param {ArrayBuffer} arrayBuffer
   * @param {number} start
   * @param {number} length
   */
  function readUtf8(arrayBuffer, start, length) {
    return decodeURIComponent(escape(String.fromCharCode.apply(
      null, new Uint8Array(arrayBuffer, start, length)
    )))
  }

  /**
   * @param {string} url
   * @param {function} callback
   */
  function fetchArrayBuffer(url, callback) {
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

  /**
   * @param {ArrayBuffer} arrayBuffer
   */
  function decode(arrayBuffer) {
    var frames = []
    var offset = 0
    var size = arrayBuffer.byteLength
    var data = new DataView(arrayBuffer)

    while (offset < size) {
      var sec = data.getUint32(offset, true)
      offset += 4
      var usec = data.getUint32(offset, true)
      offset += 4
      var length = data.getUint32(offset, true)
      offset += 4

      frames.push({
        time: sec * 1000 + usec / 1000,
        content: readUtf8(arrayBuffer, offset, length)
      })

      offset += length
    }

    return frames
  }

  function TermPlayer(options) {
    EventEmitter.call(this)

    var term = new Terminal(options)
    term.open()

    this.term = term
  }

  inherits(TermPlayer, EventEmitter)

  extend(TermPlayer.prototype, {

    speed: 1,

    play: function(frames) {
      if (frames) {
        this.frames = frames
      }
      this.term.reset()
      this.step = 0
      this.next()
    },

    pause: function() {
      clearTimeout(this._nextTimer)
    },

    resume: function() {
      this.next()
    },

    next: function() {
      var step = this.step
      var frames = this.frames
      var currentFrame = frames[step]
      var nextFrame = frames[step + 1]
      var str = currentFrame.content
      this.term.write(str)
      this.step = step + 1

      if (nextFrame) {
        var self = this
        this._nextTimer = setTimeout(
          function() {
            self.next()
          },
          (nextFrame.time - currentFrame.time) / this.speed
        )
      }
    },

    load: function(url) {
      var player = this

      fetchArrayBuffer(url, function(err, data) {
        if (err) {
          return player.emit('loadError', err)
        }
        var frames
        try {
          frames = decode(data)
        } catch (err) {
          return player.emit('loadError', err)
        }

        player.play(frames)
      })
    }
  })

  TermPlayer.decode = decode

  /**
   * Usage:
   *
   * <div
   *  data-termplayer-source="./a.rec"
   *  data-termplayer-cols="120"
   *  data-termplayer-rows="40"
   * ></div>
   *
   * TermPlayer.initAll()
   */
  TermPlayer.initAll = function() {
    var attrSource = 'data-termplayer-source'
    var targets = document.querySelectorAll('[' + attrSource + ']')
    var target

    for (var i = 0; i < targets.length; i++) {
      target = targets[i]
      new TermPlayer({
        parent: target,
        cols: parseInt(target.getAttribute('data-termplayer-cols') || defaultCols, 10),
        rows: parseInt(target.getAttribute('data-termplayer-rows') || defaultRows, 10)
      }).load(target.getAttribute(attrSource))
    }
  }

  window.TermPlayer = TermPlayer
})()
