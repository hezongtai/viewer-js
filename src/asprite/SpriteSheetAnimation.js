'use strict'

export default class SpriteSheetAnimation {
  constructor(name, url, directions) {
    PIXI.loader
      .add(name, url)
      .load((loader, resources) => {
        const baseURL = /(.+)\/(.+\.json)$/.exec(url)[1]
        this.frames = getFrames(baseURL, resources[name].data, directions)
        const maskURL = /(.+)(.json)$/.exec(url)[1] + '_a.png'
        this.mask = PIXI.Texture.fromImage(maskURL)
        this.isReady = true
      })

    this.isReady = false
  }

  getDirectionsNum() {
    if(!this.isReady) return 0
    return this.frames.length
  }

  getFramesNum() {
    if(!this.isReady) return 0
    if(this.frames.length === 0) return 0
    return this.frames[0].length
  }

  getFrame(direction, frame) {
    if(!this.isReady) return
    return this.frames[direction][frame]
  }
}

function getFrames(baseURL, frameData, dirs) {
  const frameNum = frameData.meta.totalFrames / dirs.length
  const imageURL = frameData.meta.image

  const bTexture = PIXI.BaseTexture.fromImage(`${baseURL}/${imageURL}`)
  const textures = []

  for(let i = 0; i < dirs.length; i++) {
    const frameNames = generateFrameNames(0, frameNum - 1, dirs[i], '.png', 4)

    const f = []
    for(let i = 0; i < frameNames.length; i++) {
      const frame = frameData.frames[frameNames[i]]
      const size = new PIXI.Rectangle(
          frame.frame.x,
          frame.frame.y,
          frame.frame.w,
          frame.frame.h
        )

      const trim = new PIXI.Rectangle(
          frame.spriteSourceSize.x,
          frame.spriteSourceSize.y,
          frame.sourceSize.w,
          frame.sourceSize.h
        )
      const texture = new PIXI.Texture(bTexture, size, size.clone(), trim, false)
      f.push(texture)
    }
    textures.push(f)
  }

  return textures
}

function generateFrameNames(start, end, prefix, suffix, zeroPad) {
  if(suffix === undefined) suffix = ''

  const output = []
  let frame = ''

  if(start < end) {
    for(let i = start; i <= end; i++) {
      frame = pad(i.toString(), zeroPad, '0', 1)
      frame = prefix + frame + suffix
      output.push(frame)
    }
  }else {
    for(let i = start; i >= end; i--) {
      frame = pad(i.toString(), zeroPad, '0', 1)
      frame = prefix + frame + suffix
      output.push(frame)
    }
  }

  return output
}

function pad(str, len, pad, dir) {
  if (len === undefined) len = 0
  if (pad === undefined) pad = ' '
  if (dir === undefined) dir = 3

  str = str.toString()

  let padlen = 0
  let right = 0
  let left = 0

  if (len + 1 >= str.length) {
    switch (dir) {
      case 1:
        str = new Array(len + 1 - str.length).join(pad) + str
        break
      case 3:
        right = Math.ceil((padlen = len - str.length) / 2)
        left = padlen - right
        str = new Array(left + 1).join(pad) + str + new Array(right + 1).join(pad)
        break

      default:
        str += new Array(len + 1 - str.length).join(pad)
        break
    }
  }

  return str
}
