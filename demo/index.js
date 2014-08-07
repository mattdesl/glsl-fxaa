var baboon = require('baboon-image')
var addEvent = require('add-event-listener')
var style = require('dom-style')
var clear = require('gl-clear')({ color: [1,1,1,1] })

var size = {
    width: baboon.shape[1],
    height: baboon.shape[0]
}

//grab WebGL context with size
var gl = require('webgl-context')(size)

//A quick and dirty way of wrapping ndarray as kami-texture
var tex = require('kami-texture')(gl, {
    width: size.width,
    height: size.height,
    data: new Uint8Array(baboon.data)
})

//setup a sprite batcher
var batch = require('kami-batch')(gl)

//Get the preprocessed source
var glslify = require('glslify')
var source = glslify({
    vertex: './simple.vert', //optimized.vert
    fragment: './simple.frag', //optimized.frag
    sourceOnly: true,
})

//And compile it as a shader
var shader = require('kami-shader')(gl, source)

require('domready')(function() {
    var enabled = true

    function toggle(ev) {
        ev.preventDefault()
        enabled = !enabled
        render()
    }

    function render() {
        //clear GL canvas
        clear(gl)

        //setup viewport
        gl.viewport(0, 0, size.width, size.height)
        batch.resize(size.width, size.height)

        //bind our shader
        batch.begin()
        batch.shader = shader

        //after starting the batch, we can set our uniform values
        batch.shader.setUniformf("resolution", size.width, size.height)
        batch.shader.setUniformi("enabled", enabled)

        batch.draw(tex)
        batch.end()    
    }
    
    document.body.appendChild(gl.canvas)
    render()

    var text = document.createElement("div")
    text.innerHTML = 'click the image to toggle FXAA'

    addEvent(gl.canvas, "touchdown", toggle)
    addEvent(gl.canvas, "mousedown", toggle)

    document.body.appendChild(text)
    style(document.body, { margin: '0', fontFamily: "'Helvetica', sans-serif" })
    style(text, { margin: '15px' })
})