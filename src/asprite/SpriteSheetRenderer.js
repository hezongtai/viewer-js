'use strict'

import glslify from 'glslify'

export default class SpriteSheetRenderer extends PIXI.SpriteRenderer {
  flush() {
    // If the batch is length 0 then return as there is nothing to draw
    if (this.currentBatchSize === 0) return

    const gl = this.renderer.gl
    let shader

    // upload the verts to the buffer
    if (this.currentBatchSize > (this.size * 0.5)) {
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices)
    }else{
      const view = this.positions.subarray(0, this.currentBatchSize * this.vertByteSize)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, view)
    }

    let nextTexture
    let nextBlendMode
    let nextShader
    let batchSize = 0
    let start = 0

    let currentBaseTexture = null
    let currentBlendMode = this.renderer.blendModeManager.currentBlendMode
    let currentShader = null

    let blendSwap = false
    let shaderSwap = false
    let sprite

    for (let i = 0, j = this.currentBatchSize; i < j; i++) {
      sprite = this.sprites[i]

      nextTexture = sprite._texture.baseTexture
      nextBlendMode = sprite.blendMode
      nextShader = this.shader

      blendSwap = currentBlendMode !== nextBlendMode
      shaderSwap = currentShader !== nextShader // should I use uidS???

      if (currentBaseTexture !== nextTexture || blendSwap || shaderSwap) {
        this.renderBatch(currentBaseTexture, batchSize, start)

        start = i
        batchSize = 0
        currentBaseTexture = nextTexture

        if (blendSwap) {
          currentBlendMode = nextBlendMode
          this.renderer.blendModeManager.setBlendMode(currentBlendMode)
        }

        currentShader = nextShader
        shader = currentShader
        // set shader function???
        this.renderer.shaderManager.setShader(shader)

        // TODO - i KNOW this can be optimised! Once v3 is stable il look at this next...
        shader.uniforms.projectionMatrix.value = this.renderer.currentRenderTarget.projectionMatrix.toArray(true)
        shader.uniforms.mapSampler.value = sprite.maskTexture
        // Make this a little more dynamic / intelligent!
        shader.syncUniforms()

        // TODO investigate some kind of texture state managment??
        // need to make sure this texture is the active one for all the batch swaps..
        gl.activeTexture(gl.TEXTURE0)

        // this.renderer.updateTexture(currentBaseTexture)

        // upload map texture
        // gl.activeTexture(gl.TEXTURE1)
        // this.renderer.updateTexture(currentBaseTexture._map)

        // both thease only need to be set if they are changing..
        // set the projection
        // gl.uniformMatrix3fv(shader.uniforms.projectionMatrix._location, false, this.renderer.currentRenderTarget.projectionMatrix.toArray(true))
      }

      batchSize++
    }

    this.renderBatch(currentBaseTexture, batchSize, start)

    // then reset the batch!
    this.currentBatchSize = 0
  }

  renderBatch(texture, size, startIndex) {
    if (size === 0) return

    const gl = this.renderer.gl

    if (texture._glTextures[gl.id]) {
      // bind the current texture
      gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id])
    }else{
      this.renderer.updateTexture(texture)
    }

    // now draw those suckas!
    gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, startIndex * 6 * 2)

    // increment the draw count
    this.renderer.drawCount++

    /// console.log(this.renderer.drawCount)
  }

  onContextChange() {
    const gl = this.renderer.gl

    const customUniforms = {
      mapSampler: {type: 'sampler2D', value: 0}
    }

    // setup default shader
    this.shader = new PIXI.TextureShader(
      this.renderer.shaderManager,
      PIXI.TextureShader.defaultVertexSrc,
      glslify('./SpriteSheet.frag'),
      customUniforms
    )

    // create a couple of buffers
    this.vertexBuffer = gl.createBuffer()
    this.indexBuffer = gl.createBuffer()

    // upload the index data
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW)

    this.currentBlendMode = 99999
  }
}

PIXI.WebGLRenderer.registerPlugin('SpriteSheetRenderer', SpriteSheetRenderer)
