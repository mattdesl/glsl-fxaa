var createShader = require('gl-shader')
var createTexture = require('gl-texture2d')
var triangle = require('a-big-triangle')
var glslify = require('glslify')
var loadImage = require('img')

var gl = require('webgl-context')({
  width: 512,
  height: 512,
  antialias: false
})
var canvas = gl.canvas
document.body.appendChild(canvas)

var texture
var enabled = true

//try replacing this with 'optimized.vert' and 'optimized.frag'
var shader = createShader(gl, glslify('./simple.vert'), glslify('./simple.frag'))
shader.bind()
shader.uniforms.iResolution = [ canvas.width, canvas.height ]
shader.uniforms.iChannel0 = 0
shader.uniforms.enabled = enabled

loadImage('screen.png', function (err, image) {
  if (err) throw err
  texture = createTexture(gl, image)
  texture.minFilter = gl.LINEAR
  texture.magFilter = gl.LINEAR
  render()
})

function render () {
  var width = gl.drawingBufferWidth
  var height = gl.drawingBufferHeight
  gl.viewport(0, 0, width, height)

  texture.bind()
  shader.bind()
  triangle(gl)
}

function click (ev) {
  enabled = !enabled
  shader.uniforms.enabled = enabled
  render()
}

window.addEventListener('click', click)
window.addEventListener('touchstart', function (ev) {
  window.removeEventListener('click', click)
  ev.preventDefault()
  click()
})
