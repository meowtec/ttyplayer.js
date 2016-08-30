import { readUtf8 } from './utils'

/**
 * @param {ArrayBuffer} arrayBuffer
 */
export default function decode(arrayBuffer) {
  const frames = []
  let offset = 0
  const size = arrayBuffer.byteLength
  const data = new DataView(arrayBuffer)

  while (offset < size) {
    let sec = data.getUint32(offset, true)
    offset += 4
    let usec = data.getUint32(offset, true)
    offset += 4
    let length = data.getUint32(offset, true)
    offset += 4

    frames.push({
      time: sec * 1000 + usec / 1000,
      content: readUtf8(arrayBuffer, offset, length)
    })

    offset += length
  }

  return frames
}
