# glsl-fxaa

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

[(demo)](http://mattdesl.github.io/glsl-fxaa/demo) - [(source)](./demo/index.js)

A WebGL implementation of Fast Approximate Anti-Aliasing (FXAA v2). This is a screen-space technique. The code was originally from [Geeks3D.com](http://www.geeks3d.com/20110405/fxaa-fast-approximate-anti-aliasing-demo-glsl-opengl-test-radeon-geforce/) and cleaned up by [Armin Ronacher](https://github.com/mitsuhiko/webgl-meincraft) for WebGL. 

FXAA is particularly useful in WebGL since most browsers do not currently support MSAA, and even those that do (e.g. Chrome) will not support it outside of the main frame buffer (which is common when doing post-processing effects like color grading).

## Usage

[![NPM](https://nodei.co/npm/glsl-fxaa.png)](https://nodei.co/npm/glsl-fxaa/)

#### ```vec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution)```

Returns the anti-aliased color from your frame texture. 

Inside GLSL fragment shader:

```glsl
#pragma glslify: fxaa = require(glsl-fxaa)

uniform vec2 resolution;

void main() {
	vec2 fragCoord = v_texCoord0 * resolution;
	gl_FragColor = fxaa(u_texture0, fragCoord, resolution);
}
```

### optimizing

If you plan on using FXAA instead of native anti-aliasing (i.e. for post-processed 3D scenes), disabling native AA when creating your WebGL context should give you a performance boost in some browsers.

This FXAA shader uses 9 dependent texture reads. For various mobile GPUs (particularly iOS), we can optimize the shader by making 5 of the texture2D calls non-dependent. To do this, the coordinates have to be computed in the vertex shader and passed along:

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

#pragma glslify: fxaa = require(glsl-fxaa/fxaa.glsl)

void main() {
    //can also use gl_FragCoord.xy
    vec2 fragCoord = vTexCoord0 * resolution; 

	gl_FragColor = fxaa(u_texture0, fragCoord, resolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}
```

In most cases, you should just use the simplest `index.glsl` use case demonstrated earlier. 

## demo

See the [demo](demo/) folder. To run:

```sh
# clone repo
git clone https://github.com/mattdesl/glsl-fxaa.git

# install deps
npm install

# run local host
npm start
```

Now open `localhost:9966` to test. Use `npm run build` to build a bundle.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/glsl-fxaa/blob/master/LICENSE.md) for details.
