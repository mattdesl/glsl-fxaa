precision mediump float;

//make sure to have a resolution uniform set to the screen size
uniform vec2 resolution;

//some stuff needed for kami-batch
varying vec2 vTexCoord0; 
varying vec4 vColor;
uniform sampler2D u_texture0;
uniform bool enabled;

//import our fxaa shader
#pragma glslify: fxaa = require(../)

void main() {
    //can also use gl_FragCoord.xy
    vec2 fragCoord = vTexCoord0 * resolution; 

    vec4 color;
    if (enabled) {
        color = fxaa(u_texture0, fragCoord, resolution);
    } else {
        color = texture2D(u_texture0, vTexCoord0);
    }

    gl_FragColor = color * vColor;
}
