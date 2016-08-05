precision lowp float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;
uniform sampler2D mapSampler;

void main(void){
  vec4 origin = texture2D(uSampler, vTextureCoord) * vColor;
  vec4 map = texture2D(mapSampler, vTextureCoord);
  origin.a = (map.r + map.g + map.b) * map.a;
  gl_FragColor = origin;
}
