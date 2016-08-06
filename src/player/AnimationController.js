'use strict'

import SpriteSheetAnimation from '../asprite/SpriteSheetAnimation'

export default class AnimationController {
  constructor(sprite) {
    this.sprite = sprite
  }

  setAnimation(character, move, weapon) {
    this.move = move
    this.weapon = weapon
    this.character = character

    if(AnimationController.loader.resources[character]) {
      this.createAnimations(AnimationController.loader.resources[character].data[this.weapon][this.move])
    }else{
      AnimationController.loader
        .add(character, `${character}/config.json`)
        .load((loader, resources) => {
          if(resources[character].data[this.weapon][this.move]) {
            this.createAnimations(resources[character].data[this.weapon][this.move])
          }else{
            throw new Error('move or weapon not existed')
          }
        })
    }
  }

  createAnimations(data) {
    const res = /(.+)(_a)$/.exec(data.body)
    this.bodyName = res.length > 1 ? res[1] : data.body
    this.weaponName = data.weapon

    let name = `${this.character}_${this.bodyName}`
    const baseURL = `${AnimationController.ASSETS_BASE_URL}/${this.character}`

    if(!AnimationController.animations[name]) {
      AnimationController.animations[name] = new SpriteSheetAnimation(name, `${baseURL}/${this.bodyName}.json`, 5)
    }

    name = `${this.character}_${this.weaponName}`
    if(!AnimationController.animations[name]) {
      AnimationController.animations[name] = new SpriteSheetAnimation(name, `${baseURL}/${this.weaponName}.json`, 5)
    }
  }
}

AnimationController.ASSETS_BASE_URL = './assets/sprites'
AnimationController.loader = new PIXI.loaders.Loader(AnimationController.ASSETS_BASE_URL)
AnimationController.animations = {}
