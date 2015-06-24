precision mediump float;

//texcoords computed in vertex step
//to avoid dependent texture reads
varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 vUv;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform bool enabled;

//import the fxaa function
#pragma glslify: fxaa = require('../fxaa.glsl')

void main() {
  //can also use gl_FragCoord.xy
  mediump vec2 fragCoord = vUv * iResolution; 

  vec4 color;
  if (enabled) {
      color = fxaa(iChannel0, fragCoord, iResolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
  } else {
      color = texture2D(iChannel0, vUv);
  }

  gl_FragColor = color;
}
