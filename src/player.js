'use strict'

var Core = require('./core')
var Terminal = require('../libs/xterm.js')
var decode = require('./decode')
var inherits = Terminal.inherits
var EventEmitter = Terminal.EventEmitter

var _ = require('./utils')
var E = _.e

function TermPlayer(options) {
  EventEmitter.call(this)
  this.bindThis()

  this.options = _.assign({}, options)
  this.mount(options.parent)
  this.createCorePlayer()
  this.bindEvent()
}

inherits(TermPlayer, EventEmitter)

_.assign(TermPlayer.prototype, {

  mount: function(parentNode) {
    var target, playButton

    var container =
    E('div', 'ttyplayer', [
      E('header', 'ttyplayer-header', 'TTYPlayer'),
      target = E('div', 'ttyplayer-body'),
      E('footer', 'ttyplayer-footer', [
        playButton = E('button', 'play', '')
      ])
    ])
    parentNode.appendChild(container)
    this.options.parent = target
    this.playButton = playButton
  },

  bindThis: function() {
    this.playClick = this.playClick.bind(this)
  },

  bindEvent: function() {
    this.playButton.addEventListener('click', this.playClick)
  },

  playClick: function() {
    var isPlaying = this.player.getStatus()
    console.log(isPlaying ? 'pause' : 'play')
    if (isPlaying) {
      this.pause()
    } else {
      this.resume()
    }
  },

  createCorePlayer: function() {
    var player = new Core(this.options)
    this.player = player
  },

  play: function(frames) {
    this.player.play(frames)
    this.playButton.className = 'pause'
  },

  pause: function() {
    this.player.pause()
    this.playButton.className = 'play'
  },

  resume: function() {
    this.player.resume()
    this.playButton.className = 'pause'
  },

  load: function(url) {
    var player = this

    _.fetchArrayBuffer(url, function(err, data) {
      if (err) {
        return player.emit('loadError', err)
      }
      var frames
      try {
        frames = decode(data)
      } catch (err) {
        console.error(err)
        return player.emit('loadError', err)
      }

      player.play(frames)
    })
  }

})

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

module.exports = TermPlayer
