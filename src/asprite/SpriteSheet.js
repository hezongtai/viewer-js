'use strict'
export default class SpriteSheet extends PIXI.Sprite {
  setAnimationFrame(frame, mask) {
    if(frame && frame.baseTexture.hasLoaded) this._texture = frame
    if(mask && mask.baseTexture.hasLoaded) this.maskTexture = mask
  }

  _renderWebGL(renderer) {
    renderer.setObjectRenderer(renderer.plugins.SpriteSheetRenderer)
    renderer.plugins.SpriteSheetRenderer.render(this)
  }
}
