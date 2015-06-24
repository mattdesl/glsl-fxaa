precision mediump float;

uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform bool enabled;

//import our fxaa shader
#pragma glslify: fxaa = require('../')

void main() {
  vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
  uv.y = 1.0 - uv.y;

  //can also use gl_FragCoord.xy
  vec2 fragCoord = uv * iResolution; 

  vec4 color;
  if (enabled) {
      color = fxaa(iChannel0, fragCoord, iResolution);
  } else {
      color = texture2D(iChannel0, uv);
  }

  gl_FragColor = color;
}
