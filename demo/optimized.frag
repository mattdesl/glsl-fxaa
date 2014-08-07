precision mediump float;

//texcoords computed in vertex step
//to avoid dependent texture reads
varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

//make sure to have a resolution uniform set to the screen size
uniform vec2 resolution;

//some stuff needed for kami-batch
varying vec2 vTexCoord0; 
varying vec4 vColor;
uniform sampler2D u_texture0;
uniform bool enabled;

//import the fxaa function
#pragma glslify: fxaa = require(../fxaa.glsl)

void main() {
    //can also use gl_FragCoord.xy
    mediump vec2 fragCoord = vTexCoord0 * resolution; 

    vec4 color;

    if (enabled) {
        color = fxaa(u_texture0, fragCoord, resolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
    } else {
        color = texture2D(u_texture0, vTexCoord0);
    }

    gl_FragColor = color * vColor;
}
