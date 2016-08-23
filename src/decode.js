'use strict'

var _ = require('./utils')

/**
 * @param {ArrayBuffer} arrayBuffer
 */
module.exports = function decode(arrayBuffer) {
  var frames = []
  var offset = 0
  var size = arrayBuffer.byteLength
  var data = new DataView(arrayBuffer)

  while (offset < size) {
    var sec = data.getUint32(offset, true)
    offset += 4
    var usec = data.getUint32(offset, true)
    offset += 4
    var length = data.getUint32(offset, true)
    offset += 4

    frames.push({
      time: sec * 1000 + usec / 1000,
      content: _.readUtf8(arrayBuffer, offset, length)
    })

    offset += length
  }

  return frames
}
