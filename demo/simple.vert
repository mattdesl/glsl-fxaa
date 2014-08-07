precision mediump float;

//incoming Position attribute from our SpriteBatch
attribute vec2 Position;
attribute vec4 Color;
attribute vec2 TexCoord0;

uniform vec2 u_projection;
varying vec2 vTexCoord0;
varying vec4 vColor;

void main(void) {
   gl_Position = vec4( Position.x / u_projection.x - 1.0, Position.y / -u_projection.y + 1.0 , 0.0, 1.0);
   vTexCoord0 = TexCoord0;
   vColor = Color;
}