'use strict'

import SpriteSheetAnimation from '../asprite/SpriteSheetAnimation'

export default class AnimationController {
  constructor(sprite) {
    this.sprite = sprite
    this.isReady = false

    this._now = 0
    this._delta = 0
    this._then = Date.now()

    this.setFPS(15)

    this.currentDirection = 0

    this.loop = true
  }

  setAnimation(character, move, weapon, directions, loop) {
    this.character = character
    this.move = move
    this.weapon = weapon
    this.directions = directions

    this.loop = loop
    this.rewind()

    this.isReady = false

    if(PIXI.loader.resources[character]) {
      this.createAnimations(PIXI.loader.resources[character].data[this.weapon][this.move])
    }else{
      PIXI.loader
        .add(character, `${AnimationController.ASSETS_BASE_URL}/${character}/config.json`)
        .load((loader, resources) => {
          if(resources[character].data[this.weapon][this.move]) {
            this.createAnimations(resources[character].data[this.weapon][this.move])
          }else{
            throw new Error('move or weapon not existed')
          }
        })
    }
  }

  setDirection(dir) {
    this.currentDirection = dir
    if(!this.loop) {
      this.completed = false
      this.currentFrame = -1
    }
  }

  rewind() {
    this.currentFrame = -1
    this.completed = false
  }

  createAnimations(data) {
    const res = /(.+)(_a)$/.exec(data.body)
    this.bodyName = res.length > 1 ? res[1] : data.body
    this.weaponName = data.weapon

    let name = `${this.character}_${this.bodyName}`
    const baseURL = `${AnimationController.ASSETS_BASE_URL}/${this.character}`

    if(!AnimationController.animations[name]) {
      AnimationController.animations[name] = new SpriteSheetAnimation(name, `${baseURL}/${this.bodyName}.json`, this.directions)
    }

    name = `${this.character}_${this.weaponName}`
    if(!AnimationController.animations[name]) {
      AnimationController.animations[name] = new SpriteSheetAnimation(name, `${baseURL}/${this.weaponName}.json`, this.directions)
    }

    this.isReady = true
  }

  setFPS(fps) {
    this.fps = fps
    this.delay = 1000 / fps
  }

  update() {
    if(this.isReady) {
      this._now = Date.now()
      this._delta = this._now - this._then

      if(this._delta < this.delay) return
      this._then = this._now - (this._delta % this.delay)

      let name = `${this.character}_${this.bodyName}`
      const bAnim = AnimationController.animations[name]

      name = `${this.character}_${this.weaponName}`
      const wAnim = AnimationController.animations[name]

      if(bAnim.isReady && wAnim.isReady) {
        this.nextFrame(bAnim, wAnim)
      }
    }
  }

  nextFrame(bodyAnim, weaponAnim) {
    const len = bodyAnim.getFramesNum()
    if(len < 0) return
    if(this.completed) return

    if(this.currentFrame < len) {
      this.currentFrame ++
    }else{
      if(!this.loop && !this.completed) {
        this.completed = true
        return
      }

      this.currentFrame = 0
    }

    const direction = Math.abs(this.currentDirection)

    let frame = bodyAnim.getFrame(direction, this.currentFrame)
    this.sprite._body.setAnimationFrame(frame, bodyAnim.mask)

    frame = weaponAnim.getFrame(direction, this.currentFrame)
    this.sprite._weapon.setAnimationFrame(frame, weaponAnim.mask)
  }
}

AnimationController.ASSETS_BASE_URL = './assets/sprites'
AnimationController.animations = {}
