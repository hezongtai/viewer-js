'use strict'

import Hammer from 'hammerjs'
import Player from './player/Player'
import Fixer from './player/AnimationFixer'

const renderer = new PIXI.WebGLRenderer($(window).width(), $(window).height())
renderer.backgroundColor = 0xC0C0C0

// character's name
let currentCharacterName = 'shala'
let currentWeapon = 'sword'

// create player
$('#content').append(renderer.view)

const stage = new PIXI.Container()

const player = new Player()

player.x = $(window).width() * 0.5
player.y = $(window).height() * 0.5

player.animation.setAnimation(currentCharacterName, Fixer.getAction().name, currentWeapon, Fixer.getAction().dirs, true)
stage.addChild(player)

animate()

function animate() {
  player.update()
  renderer.render(stage)
  requestAnimationFrame(animate)
}

// buttons
$('#chSelector').click(e => {
  e.preventDefault()
  $('#wrapper').toggleClass('toggled')
})

// create hammerjs handlers
const mc = new Hammer.Manager(document.getElementById('content'))
mc.add(new Hammer.Swipe())
mc.add(new Hammer.Tap({taps: 2}))

mc.on('swipeleft', prevDir)

function prevDir() {
  const pad = Fixer.prevDir()
  player.animation.setDirection(pad.index)
  player.scale.x = pad.flipped ? -1 : 1
}

mc.on('swiperight', nextDir)

function nextDir() {
  const pad = Fixer.nextDir()
  console.log(pad)
  player.animation.setDirection(pad.index)
  player.scale.x = pad.flipped ? -1 : 1
}

mc.on('swipeup', () => {
  const pad = Fixer.prevAction()
  player.animation.setDirection(pad.index)
  player.scale.x = pad.flipped ? -1 : 1

  player.animation.setAnimation(currentCharacterName, Fixer.getAction().name, currentWeapon, Fixer.getAction().dirs, Fixer.getAction().loop)
})

mc.on('swipedown', () => {
  const pad = Fixer.nextAction()
  player.animation.setDirection(pad.index)
  player.scale.x = pad.flipped ? -1 : 1

  player.animation.setAnimation(currentCharacterName, Fixer.getAction().name, currentWeapon, Fixer.getAction().dirs, Fixer.getAction().loop)
})

mc.on('tap', () => {
  player.animation.rewind()
})

