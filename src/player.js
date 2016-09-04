import './player.less'

import Core from './player-core'
import Select from './select'
import Component from './component'
import decode from './decode'
import { element as $, assign, fetchArrayBuffer } from './utils'
import template from './player.htm'

const defaultCols = 80
const defaultRows = 20

class TTYPlayer extends Component {
  constructor(options) {
    super()

    const optionsCopy = assign({}, options)
    if (!optionsCopy.rows) {
      optionsCopy.rows = defaultRows
    }
    if (!optionsCopy.cols) {
      optionsCopy.cols = defaultCols
    }
    this.options = optionsCopy

    this.mount(options.parent)
    this.createCorePlayer()
    this.delegate()
    this.createSpeedSelect()
    this.bindEvent()

    this.set('isPlaying', false)
  }

  onChange(key, value) {
    if (key === 'isPlaying') {
      this.refs.playButton.classList[value ? 'add' : 'remove']('tty-hide')
      this.refs.pauseButton.classList[value ? 'remove' : 'add']('tty-hide')
      return
    }
  }

  mount(parentNode) {
    const { element, refs } = $(template)

    parentNode.appendChild(element)
    this.element = element
    this.parentNode = parentNode
    this.options.parent = refs.body
    this.refs = refs
  }

  unmount() {
    this.parentNode.removeChild(this.element)
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

  unbindEvent() {
    this.refs.playButton.removeEventListener('click', this.resume)
    this.refs.pauseButton.removeEventListener('click', this.pause)
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

  destroy() {
    this.player.destroy()
    this.speedSelect.destroy()
    this.unbindEvent()
    this.removeAllListeners()
    this.unmount()
  }
}

TTYPlayer.VERSION = VERSION

module.exports = TTYPlayer
