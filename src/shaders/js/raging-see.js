import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import vertexShader from './glsl/water/vertex.glsl'
import fragmentShader from './glsl/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Colors
debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uBigSpeed: { value: 0.75 },
    uBigElevation: { value: 0.2 },
    uBigFrequency: { value: new THREE.Vector2(4, 1.5) },
    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0 },
    uColorMultiplier: { value: 1 },
    uSmallElevation: { value: 0.1 },
    uSmallFrequency: { value: 3 },
    uSmallSpeed: { value: 0.2 },
    uSmallIterations: { value: 4 }
  }
})

// Debug
gui.add(waterMaterial.uniforms.uBigElevation, 'value').min(0).max(1).step(0.001).name('Big Elevation')
gui.add(waterMaterial.uniforms.uBigFrequency.value, 'x').min(0).max(10).step(0.001).name('Big Frequency X')
gui.add(waterMaterial.uniforms.uBigFrequency.value, 'y').min(0).max(10).step(0.001).name('Big Frequency Y')
gui.add(waterMaterial.uniforms.uBigSpeed, 'value').min(0).max(4).step(0.001).name('Big Speed')
gui.addColor(debugObject, 'depthColor').onChange(() => {
  waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
})
gui.addColor(debugObject, 'surfaceColor').onChange(() => {
  waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
})
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(10).step(0.001).name('Color Offset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('Color Multiplier')

gui.add(waterMaterial.uniforms.uSmallElevation, 'value').min(0).max(1).step(0.001).name('Small Elevation')
gui.add(waterMaterial.uniforms.uSmallFrequency, 'value').min(0).max(10).step(0.001).name('Small Frequency')
gui.add(waterMaterial.uniforms.uSmallSpeed, 'value').min(0).max(4).step(0.001).name('Small Speed')
gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(10).step(1).name('Small Iterations')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = -Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update water
  waterMaterial.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
