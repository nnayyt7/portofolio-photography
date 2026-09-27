uniform float uTime;
uniform vec2 uPointer;
uniform float uOpacity;
uniform sampler2D uFlow;
uniform vec2 uViewport;
uniform vec4 uRect;
varying vec2 vUv;

float field(vec2 p, vec2 c, vec2 stretch, float k) {
  vec2 q = (p - c) * stretch;
  return exp(-dot(q, q) * k);
}
void main() {
  vec2 p = vUv - 0.5;
  vec2 screenUv = vec2((uRect.x + vUv.x * uRect.z) / uViewport.x, 1.0 - (uRect.y + (1.0 - vUv.y) * uRect.w) / uViewport.y);
  vec2 flow = (texture2D(uFlow,screenUv).rg - 128.0/255.0) * 2.0;
  p -= flow * .42;
  float angle = -0.45;
  p = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p;
  p -= uPointer * 0.025;
  p.x += sin(p.y * 9.0 + uTime * 0.22) * 0.048;
  p.y += sin(p.x * 8.0 - uTime * 0.18) * 0.024;
  float core = field(p, vec2(-0.12, -0.07), vec2(1.8, 2.3), 16.0);
  float tail = field(p, vec2(0.13, 0.02), vec2(1.2, 6.0), 11.0);
  float tip = field(p, vec2(0.25, 0.065), vec2(2.8, 4.5), 13.0);
  float light = core + tail * 0.7 + tip * 0.55;
  vec3 red = vec3(1.0, 0.026, 0.012);
  vec3 hot = vec3(1.0, 0.78, 0.51);
  float hotspot = field(p, vec2(-0.15, -0.1), vec2(2.8, 4.0), 24.0);
  vec3 color = mix(red, hot, clamp(hotspot * 0.92, 0.0, 1.0));
  float alpha = smoothstep(0.025, 0.48, light) * min(1.0, light * 2.5);
  gl_FragColor = vec4(color, alpha * uOpacity);
}
