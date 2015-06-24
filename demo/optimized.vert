precision mediump float;

//texcoords computed in vertex step
//to avoid dependent texture reads
varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

//a resolution for our optimized shader
uniform vec2 iResolution;
attribute vec2 position;
varying vec2 vUv;

#pragma glslify: texcoords = require('../texcoords.glsl')

void main(void) {
   gl_Position = vec4(position, 1.0, 1.0);
   
   //compute the texture coords and send them to varyings
   vUv = (position + 1.0) * 0.5;
   vUv.y = 1.0 - vUv.y;
   vec2 fragCoord = vUv * iResolution;
   texcoords(fragCoord, iResolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}