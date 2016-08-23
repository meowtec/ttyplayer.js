'use strict'

var Terminal = require('../libs/xterm.js')
var EventEmitter = Terminal.EventEmitter
var inherits = Terminal.inherits
var _ = require('./utils')

var defaultCols = 80
var defaultRows = 30

function TermPlayer(options) {
  EventEmitter.call(this)

  var term = new Terminal(options)
  term.open()

  this.term = term
}

inherits(TermPlayer, EventEmitter)

_.assign(TermPlayer.prototype, {

  speed: 1,

  repeat: true,

  interval: 3000,

  getStatus: function() {
    return this._playing
  },

  onEnd: function() {
    return this.step === this.frames.length
  },

  play: function(frames) {
    if (frames) {
      this.frames = frames
    }
    this.term.reset()
    this.step = 0
    this.frame()
  },

  pause: function() {
    clearTimeout(this._nextTimer)
    this._playing = false
  },

  resume: function() {
    if (this.onEnd()) {
      this.play()
    } else {
      this.frame()
    }
  },

  frame: function() {
    var step = this.step
    var frames = this.frames
    var currentFrame = frames[step]
    var nextFrame = frames[step + 1]
    var str = currentFrame.content
    this.term.write(str)
    this.step = step + 1
    this._playing = true

    this.next(currentFrame, nextFrame)
  },

  next: function(currentFrame, nextFrame) {
    var player = this

    if (nextFrame) {
      this._nextTimer = setTimeout(
        function() {
          player.frame()
        },
        (nextFrame.time - currentFrame.time) / this.speed
      )
    } else if (this.repeat) {
      this._nextTimer = setTimeout(function() {
        player.play()
      }, this.interval)
    } else {
      this.emit('end')
      this._playing = false
    }
  }

})

module.exports = TermPlayer
