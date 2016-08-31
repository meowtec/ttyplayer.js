import './player.less'

import Core from './player-core'
import Select from './select'
import Component from './component'
import decode from './decode'
import { element as $, assign, fetchArrayBuffer } from './utils'
import template from './player.htm'

export default class TermPlayer extends Component {
  constructor(options) {
    super()

    this.options = assign({}, options)
    this.mount(options.parent)
    this.createCorePlayer()
    this.delegate()
    this.createSpeedSelect()
    this.bindEvent()

    this.set('isPlaying', false)
  }

  onChange(key, value) {
    if (key === 'isPlaying') {
      this.refs.playButton.classList[value ? 'add' : 'remove']('hide')
      this.refs.pauseButton.classList[value ? 'remove' : 'add']('hide')
      return
    }
  }

  mount(parentNode) {
    const { element, refs } = $(template)

    parentNode.appendChild(element)
    this.options.parent = refs.body
    this.refs = refs
  }

  delegate() {
    const player = this.player

    ;[ 'play', 'resume', 'pause' ].forEach(method => {
      this[method] = player[method].bind(player)
    })
  }

  bindEvent() {
    this.refs.playButton.addEventListener('click', this.resume)
    this.refs.pauseButton.addEventListener('click', this.pause)

    this.player.on('play', () => {
      this.set('isPlaying', true)
    })

    this.player.on('pause', () => {
      this.set('isPlaying', false)
    })

    this.speedSelect.on('change', value => {
      this.player.speed = value
    })
  }

  createCorePlayer() {
    this.player = new Core(this.options)
  }

  createSpeedSelect() {
    this.speedSelect = new Select(this.refs.speedButton, this.refs.speedSelect)
  }

  load(url) {
    fetchArrayBuffer(url, (err, data) => {
      if (err) {
        return this.emit('loadError', err)
      }
      let frames
      try {
        frames = decode(data)
      } catch (err) {
        console.error(err)
        return this.emit('loadError', err)
      }

      this.play(frames)
    })
  }

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
  static initAll() {
    const attrSource = 'data-termplayer-source'
    const targets = document.querySelectorAll('[' + attrSource + ']')
    let target

    for (let i = 0; i < targets.length; i++) {
      target = targets[i]
      new TermPlayer({
        parent: target,
        cols: parseInt(target.getAttribute('data-termplayer-cols') || defaultCols, 10),
        rows: parseInt(target.getAttribute('data-termplayer-rows') || defaultRows, 10)
      }).load(target.getAttribute(attrSource))
    }
  }
}

window.TermPlayer = TermPlayer