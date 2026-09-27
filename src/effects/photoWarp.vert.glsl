uniform sampler2D uFlow;
uniform vec2 uViewport;
uniform vec4 uRect;
uniform float uWarp;
varying vec2 vUv;
varying vec2 vScreenUv;

void main() {
  vUv = uv;
  vScreenUv = vec2((uRect.x + uv.x * uRect.z) / uViewport.x, 1.0 - (uRect.y + (1.0 - uv.y) * uRect.w) / uViewport.y);
  vec2 flow = (texture2D(uFlow, vScreenUv).rg - 128.0/255.0) * 2.0;
  vec3 p = position;
  p.xy += flow * uWarp / max(uRect.zw, vec2(1.0));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
