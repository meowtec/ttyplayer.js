import Terminal from '../libs/xterm.js'

const EventEmitter = Terminal.EventEmitter

export default class Component extends EventEmitter {
  constructor() {
    super()
  }

  set(key, value) {
    const data = this.data || (this.data = {})
    const prev = this.get(key)
    data[key] = value
    if (prev !== value) {
      this.onChange && this.onChange(key, value)
    }
  }

  get(key) {
    return this.data && this.data[key]
  }
}
