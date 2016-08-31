import { assign } from './utils'

export default class Timer {
  constructor(callback, time, rate = 1) {
    this._rate = rate
    this._setTimeout(callback, time)
  }

  set rate(x) {
    this._rate = x

    if (this._rest == null) {
      this.pause()
      this.resume()
    }
  }

  get rest() {
    if (this.finish) {
      return 0
    } else if (this._rest) {
      return this._rest
    } else {
      const rest = this._time - (new Date() - this._startTime)
      return rest > 0 ? rest : 0
    }
  }

  get finish() {
    return this._finish
  }

  _setTimeout(callback, time) {
    this._timer = setTimeout(() => {
      callback()
      this._finish = true
      this._rest = null
    }, time / this._rate)

    this._finish = false
    this._time = time
    this._startTime = new Date()
    this._callback = callback
    this._rest = null
  }

  pause() {
    clearTimeout(this._timer)
    this._rest = this.rest
  }

  resume() {
    if (this._rest != null) {
      this._setTimeout(this._callback, this._rest)
    }
  }

  clear() {
    this.pause()
    this._rest = null
  }
}

