import Timer from './timer'
import Terminal from '../libs/xterm.js'
import { assign } from './utils'
const EventEmitter = Terminal.EventEmitter

export default class TTYCorePlayer extends EventEmitter {
  constructor(options) {
    super()

    const term = new Terminal(options)
    term.open()

    this.term = term
  }

  atEnd() {
    return this.step === this.frames.length
  }

  play(frames) {
    if (frames) {
      this.frames = frames
    }
    this.term.reset()
    this.step = 0
    this.renderFrame()
    this.emit('play')
  }

  pause() {
    this._nextTimer.pause()
    this.emit('pause')
  }

  resume() {
    this._nextTimer.resume()
    this.emit('play')
  }

  renderFrame() {
    const step = this.step
    const frames = this.frames
    const currentFrame = frames[step]
    const nextFrame = frames[step + 1]
    const str = currentFrame.content
    // It seems to be unnecessary and may cause an unexpected behavior.
    // So I ignore it.
    if (str !== '\u001b[?1h\u001b=') {
      this.term.write(str)
    }
    this.step = step + 1

    this.next(currentFrame, nextFrame)
  }

  next(currentFrame, nextFrame) {
    if (nextFrame) {
      this._nextTimer = new Timer(
        _ => this.renderFrame(),
        (nextFrame.time - currentFrame.time),
        this.speed
      )
    } else if (this.repeat) {
      this._nextTimer = new Timer(
        _ => this.play(),
        this.interval,
        this.speed
      )
    } else {
      this.emit('end')
    }
  }
}

assign(TTYCorePlayer.prototype, {
  speed: 1,
  repeat: true,
  interval: 3000,
})
