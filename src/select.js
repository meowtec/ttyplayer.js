import Component from './component'
import { closet } from './utils'

export default class Select extends Component {
  constructor(trigger, select) {
    super()

    this.trigger = trigger
    this.selector = select
    this.bindEvents()
    this.set('active', false)
  }

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

    document.addEventListener('click', e => {
      this.set('active', false)
    })
  }

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
  }

  onChange(key, value) {
    if (key === 'active') {
      if (value) {
        this.selector.classList.remove('tty-hide')
      } else {
        this.selector.classList.add('tty-hide')
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
}
