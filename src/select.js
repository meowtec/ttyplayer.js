import Component from './component'
import { assign, closet } from './utils'
import Terminal from '../libs/xterm.js'

const inherits = Terminal.inherits

export default function Select(trigger, select) {
  Component.call(this)

  this.trigger = trigger
  this.selector = select
  this.bindEvents()
  this.set('active', false)
}

inherits(Select, Component)

assign(Select.prototype, {

  bindEvents() {
    this.trigger.addEventListener('click', e => {
      e.stopPropagation()
      this.set('active', !this.get('active'))
    }, false)

    this.selector.addEventListener('click', e => {
      e.preventDefault()
      const optionItem = closet(e.target, el => el.dataset.value)
      optionItem && this.select(optionItem)
    }, false)

    document.addEventListener('click', _ => {
      this.set('active', false)
    })
  },

  select(item) {
    let optionItem
    if (item.tagName) {
      optionItem = item
    } else {
      optionItem = this.selector.querySelector(`[data-value="${item}"]`)
    }

    if (optionItem) {
      let value = optionItem.dataset.value
      let text = optionItem.textContent
      this.set('value', value)
      this.set('text', text)
    }
  },

  onChange(key, value) {
    if (key === 'active') {
      if (value) {
        this.selector.classList.remove('hide')
      } else {
        this.selector.classList.add('hide')
      }
      return
    }

    if (key === 'value') {
      this.emit('change', value)
      return
    }

    if (key === 'text') {
      this.trigger.textContent = value
    }
  }
})
