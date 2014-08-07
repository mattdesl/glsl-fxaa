# glsl-fxaa

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

A WebGL implementation of Fast Approximate Anti-Aliasing (FXAA). This is a screen-space technique.

It's particularly useful for WebGL since most browsers do not currently support MSAA, and even those that do (e.g. Chrome) will not support it outside of the main frame buffer (which is common when doing post-processing effects like color grading).

## Usage

[![NPM](https://nodei.co/npm/glsl-fxaa.png)](https://nodei.co/npm/glsl-fxaa/)


Inside GLSL fragment shader:

```glsl
#pragma glslify: fxaa = require(glsl-fxaa)

uniform vec2 resolution;

void main() {
	vec2 fragCoord = v_texCoord0 * resolution;
	gl_FragColor = fxaa(u_texture0, fragCoord, resolution);
}
```

```fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution)```


### optimized

The above FXAA shader uses 9 dependent texture reads. For various mobile GPUs (particularly iOS), we can optimize the shader by making 5 of the texture2D calls non-dependent. To do this, the coordinates have to be computed in the vertex shader and passed along:

vert shader:

```glsl
varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

uniform vec2 resolution;

#pragma glslify: texcoords = require(glsl-fxaa/texcoords.glsl)

void main() {
   //compute the texture coords and store them in varyings
   vec2 fragCoord = vTexCoord0 * resolution;
   texcoords(fragCoord, resolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

   //.. rest of shader
}
```

frag shader:

```glsl
varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

uniform vec2 resolution;

#pragma glslify: fxaa = require(../fxaa.glsl)

void main() {
    //can also use gl_FragCoord.xy
    vec2 fragCoord = vTexCoord0 * resolution; 

	gl_FragColor = fxaa(u_texture0, fragCoord, resolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}
```

This may or may not lead to better performance on certain devices. For the most part; you should just use the simplest `index.glsl` use case. 


## demo

See the [demo](demo/) folder. To run with beefy:

```beefy demo/index.js --open```

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/glsl-fxaa/blob/master/LICENSE.md) for details.
