module.exports = function htmlLoader(content) {
  this.cacheable && this.cacheable()
  this.value = content
  return `module.exports = ${JSON.stringify(content.replace(/\n\s+/g, '\n'))}`
}
