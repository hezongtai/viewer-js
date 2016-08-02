'use strict'

import glslify from 'glslify'

const renderer = new PIXI.WebGLRenderer($(window).width(), $(window).height())
renderer.backgroundColor = 0xC0C0C0
$('#content').append(renderer.view)

const stage = new PIXI.Container()

class PlayerSprite extends PIXI.Sprite {
  constructor(texture, mask) {
    super(texture)
    this.maskTexture = mask
  }

  _renderWebGL(renderer) {
    console.log('render this', renderer)
    super._renderWebGL(renderer)
  }
}

PIXI.loader
  .add('config', './assets/feite/body_run.json') // load spritesheet config
  .add('base', './assets/feite/body_run.png') // load base texture
  .add('mask', './assets/feite/body_run_a.png') // load mask texture
  .load((loader, resources) => {
    const config = resources.config.data
    const f = config.frames['40000.png'].frame

    const base = new PlayerSprite(resources.base.texture)
    stage.addChild(base)

    renderer.render(stage)
  })

