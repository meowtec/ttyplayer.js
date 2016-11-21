import './player.less'

import Core from './player-core'
import Select from './select'
import Component from './component'
import decode from './decode'
import { element as $, assign, fetchArrayBuffer, replaceTpl } from './utils'
import template from './player.htm'

const defaultCols = 80
const defaultRows = 20
const hideClass = 'tty-hide'

export default class TTYPlayer extends Component {
  constructor(options) {
    super()

    const optionsCopy = assign({}, options)
    optionsCopy.rows = optionsCopy.rows || defaultRows
    optionsCopy.cols = optionsCopy.cols || defaultCols
    optionsCopy.footerStyle = optionsCopy.footerStyle || 'inset'
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
      const { playButton, pauseButton, playMask } = this.refs
      if (value) {
        playButton.classList.add(hideClass)
        pauseButton.classList.remove(hideClass)
        playMask.classList.add(hideClass)
      } else {
        playButton.classList.remove(hideClass)
        pauseButton.classList.add(hideClass)
        playMask.classList.remove(hideClass)
      }
      return
    }
  }

  mount(parentNode) {
    const { element, refs } = $(replaceTpl(template, {
      ttyfooter: 'tty-footer-' + this.options.footerStyle
    }))
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

    this.resumePlay = this.resumePlay.bind(this)
  }

  bindEvent() {
    this.refs.bigPlayButton.addEventListener('click', this.resumePlay)
    this.refs.playButton.addEventListener('click', this.resumePlay)
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

  resumePlay() {
    if (this._started) {
      this.resume()
    } else {
      this.play(this._frames)
      this._started = true
    }
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

      this._frames = frames
      if (this.options.autoplay) {
        this.play()
      }
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
TTYPlayer.Core = Core
TTYPlayer.Terminal = Core.Terminal
