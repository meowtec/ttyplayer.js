import Terminal from '../libs/xterm.js'
import { assign } from './utils'

const EventEmitter = Terminal.EventEmitter
const inherits = Terminal.inherits

export default function Component() {
  EventEmitter.call(this)
}

inherits(Component, EventEmitter)

assign(Component.prototype, {
  set(key, value) {
    const data = this.data || (this.data = {})
    const prev = this.get(key)
    data[key] = value
    if (prev !== value) {
      this.onChange && this.onChange(key, value)
    }
  },
  get(key) {
    return this.data && this.data[key]
  }
})
