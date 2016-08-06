'use strict'
import asprite from '../asprite'
import AnimationController from './AnimationController'

export default class Player extends PIXI.Container {
  constructor() {
    super()

    this.initContainers()

    this.delay = 1000 / 20
  }

  /**
   * create body & weapon's containers
   * set the anchor.x & anchor.y to 0.5
   * add them to the root container
   */
  initContainers() {
    this._body = new asprite.SpriteSheet() // create body container
    this._weapon = new asprite.SpriteSheet() // create weapon container

    this._body.anchor.x = this._body.anchor.y = this._weapon.anchor.x = this._weapon.anchor.y = 0.5

    this.addChild(this._body)
    this.addChild(this._weapon)

    this._animController = new AnimationController(this)
  }

  play(character, move, weapon) {
    this._animController.setAnimation(character, move, weapon)
  }

  /**
   * update animations & draw the frames
   */
  update() {
  }
}
