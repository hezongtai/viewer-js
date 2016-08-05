'use strict'

import asprite from './asprite'

const renderer = new PIXI.WebGLRenderer($(window).width(), $(window).height())
renderer.backgroundColor = 0xC0C0C0

$('#content').append(renderer.view)

const stage = new PIXI.Container()

const animator = new asprite.SpriteSheetAnimator('body_run', './assets/sprites/feite/body_run.json', 5)

const sp = new asprite.SpriteSheet()
stage.addChild(sp)

renderer.on('prerender', () => {
})

animate()
const delay = 1000 / 20

function animate() {
  animator.update(delay)
  sp.setAnimationFrame(animator.getCurrentFrame(), animator.mask)

  renderer.render(stage)
  requestAnimationFrame(animate)
}
