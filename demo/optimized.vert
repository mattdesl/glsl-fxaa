precision mediump float;

//texcoords computed in vertex step
//to avoid dependent texture reads
varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

//incoming Position attribute from our SpriteBatch
attribute vec2 Position;
attribute vec4 Color;
attribute vec2 TexCoord0;

//uniforms from sprite batch
uniform vec2 u_projection;
varying vec2 vTexCoord0;
varying vec4 vColor;

//a resolution for our optimized shader
uniform vec2 resolution;

#pragma glslify: texcoords = require(../texcoords.glsl)

void main(void) {
   gl_Position = vec4( Position.x / u_projection.x - 1.0, Position.y / -u_projection.y + 1.0 , 0.0, 1.0);
   vTexCoord0 = TexCoord0;
   vColor = Color;
   
   //compute the texture coords and send them to varyings
   vec2 fragCoord = vTexCoord0 * resolution;
   texcoords(fragCoord, resolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}