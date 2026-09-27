import * as THREE from 'three';

// A persistent, advected pointer field shared by photographs, type and light.
// Values are encoded around 128/255 so the byte-texture fallback rests exactly.
const vertex = `varying vec2 vUv;
void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`;
const fragment = `
precision highp float;
uniform sampler2D uPrevious;
uniform vec2 uPointer;
uniform vec2 uImpulse;
uniform vec2 uResolution;
uniform float uDelta;
uniform float uActive;
varying vec2 vUv;
const float neutral=128.0/255.0;
void main(){
  vec2 aspect=vec2(uResolution.x/uResolution.y,1.0);
  vec2 old=(texture2D(uPrevious,vUv).rg-neutral)*2.0;
  vec2 advected=vUv-old*vec2(1.0/aspect.x,1.0)*uDelta*.17;
  vec2 field=(texture2D(uPrevious,clamp(advected,.001,.999)).rg-neutral)*2.0;
  field*=exp(-uDelta*2.7);
  vec2 d=(vUv-uPointer)*aspect;
  float radius=clamp(115.0/uResolution.y,.08,.20);
  float influence=exp(-dot(d,d)/(radius*radius));
  float speed=length(uImpulse);
  vec2 curl=vec2(-d.y,d.x)/(length(d)+.055);
  field+=(uImpulse*.38+curl*speed*.34)*influence*uActive;
  if(length(field)<.012) field=vec2(0.0);
  field=clamp(field,vec2(-.97),vec2(.97));
  gl_FragColor=vec4(field*.5+neutral,0.0,1.0);
}`;

export default class PointerFlow {
  constructor(renderer) {
    this.renderer = renderer;
    this.position = new THREE.Vector2(-2, -2);
    this.impulse = new THREE.Vector2();
    this.last = new THREE.Vector2(-1000, -1000);
    this.lastTime = 0;
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex, fragmentShader: fragment,
      depthTest: false, depthWrite: false,
      uniforms: { uPrevious: { value: null }, uPointer: { value: this.position }, uImpulse: { value: this.impulse }, uResolution: { value: new THREE.Vector2(innerWidth, innerHeight) }, uDelta: { value: .016 }, uActive: { value: 0 } },
    });
    this.geometry = new THREE.PlaneGeometry(2, 2);
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.Mesh(this.geometry, this.material));
    this.camera = new THREE.Camera();
    const options = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false, stencilBuffer: false, type: THREE.UnsignedByteType };
    this.read = new THREE.WebGLRenderTarget(256, 256, options);
    this.write = this.read.clone();
    const previousColor = renderer.getClearColor(new THREE.Color()).clone();
    const previousAlpha = renderer.getClearAlpha();
    renderer.setClearColor(new THREE.Color(128 / 255, 128 / 255, 0), 1);
    for (const target of [this.read, this.write]) { renderer.setRenderTarget(target); renderer.clear(); }
    renderer.setRenderTarget(null);
    renderer.setClearColor(previousColor, previousAlpha);
  }
  move(x, y) {
    const now = performance.now();
    const elapsed = Math.max(16, now - this.lastTime);
    if (this.last.x > -900) {
      this.impulse.set(THREE.MathUtils.clamp((x - this.last.x) / elapsed * .8, -1, 1), THREE.MathUtils.clamp(-(y - this.last.y) / elapsed * .8, -1, 1));
    }
    this.position.set(x / innerWidth, 1 - y / innerHeight);
    this.last.set(x, y);
    this.lastTime = now;
  }
  leave() { this.last.set(-1000, -1000); this.impulse.set(0, 0); }
  resize() { this.material.uniforms.uResolution.value.set(innerWidth, innerHeight); }
  update(delta) {
    const dt = Math.min(delta, 50) / 1000;
    this.material.uniforms.uDelta.value = dt;
    this.material.uniforms.uActive.value = performance.now() - this.lastTime < 90 ? 1 : 0;
    this.impulse.multiplyScalar(Math.exp(-dt * 10));
    this.material.uniforms.uPrevious.value = this.read.texture;
    this.renderer.setRenderTarget(this.write);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
    [this.read, this.write] = [this.write, this.read];
    return this.read.texture;
  }
  dispose() { this.read.dispose(); this.write.dispose(); this.geometry.dispose(); this.material.dispose(); }
}
