uniform sampler2D uTexture;
uniform sampler2D uFlow;
uniform vec2 uCover;
uniform vec2 uFocal;
uniform float uHover;
uniform float uDither;
uniform float uOpacity;
uniform float uReveal;
varying vec2 vUv;
varying vec2 vScreenUv;

void main() {
  if (vUv.y < 1.0 - uReveal) discard;
  vec2 uv = vUv;
  vec2 flow = (texture2D(uFlow, vScreenUv).rg - 128.0/255.0) * 2.0;
  uv -= flow * .028;
  uv = clamp(uv, 0.001, 0.999);
  uv = uv * uCover + (1.0 - uCover) * uFocal;
  vec4 color = texture2D(uTexture, uv);
  vec2 pixel = floor(gl_FragCoord.xy / 1.5);
  float grain = fract(sin(dot(pixel, vec2(12.9898,78.233))) * 43758.5453);
  float luminance = dot(color.rgb, vec3(.299,.587,.114));
  float ink = smoothstep(grain - .065, grain + .065, pow(luminance, .75));
  vec3 printed = mix(vec3(.025),vec3(.88,.87,.83),ink);
  color.rgb = mix(color.rgb, printed, uHover * uDither);
  gl_FragColor = vec4(color.rgb, color.a * uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
