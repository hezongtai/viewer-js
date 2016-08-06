'use strict'

import Player from './player/Player'

const renderer = new PIXI.WebGLRenderer($(window).width(), $(window).height())
renderer.backgroundColor = 0xC0C0C0

$('#content').append(renderer.view)

const stage = new PIXI.Container()

const player = new Player()

player.x = $(window).width() * 0.5
player.y = $(window).height() * 0.5

player.play('feite', 'run', 'sword')

stage.addChild(player)

animate()

function animate() {
  player.update()
  renderer.render(stage)
  requestAnimationFrame(animate)
}

