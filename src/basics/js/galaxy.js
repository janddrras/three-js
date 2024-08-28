import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()
// gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Galaxy
 *
 */
const DEFAULT_PARAMS = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  random: 0.1,
  randomPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984'
}

gui.add(DEFAULT_PARAMS, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(DEFAULT_PARAMS, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(DEFAULT_PARAMS, 'radius').min(0.1).max(20).step(0.1).onFinishChange(generateGalaxy)
gui.add(DEFAULT_PARAMS, 'branches').min(2).max(10).step(1).onFinishChange(generateGalaxy)
gui.add(DEFAULT_PARAMS, 'spin').min(-5).max(5).step(0.01).onFinishChange(generateGalaxy)
gui.add(DEFAULT_PARAMS, 'random').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(DEFAULT_PARAMS, 'randomPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(DEFAULT_PARAMS, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(DEFAULT_PARAMS, 'outsideColor').onFinishChange(generateGalaxy)

let galaxyGeometry = null
let galaxyMaterial = null
let galaxy = null

function generateGalaxy() {
  const { count, size } = DEFAULT_PARAMS

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  const insideColor = new THREE.Color(DEFAULT_PARAMS.insideColor)
  const outsideColor = new THREE.Color(DEFAULT_PARAMS.outsideColor)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const radius = Math.random() * DEFAULT_PARAMS.radius
    const spinAngle = radius * DEFAULT_PARAMS.spin
    const branchAngle = ((i % DEFAULT_PARAMS.branches) / DEFAULT_PARAMS.branches) * Math.PI * 2

    const randomX = Math.pow(Math.random(), DEFAULT_PARAMS.randomPower) * (Math.random() < 0.5 ? 1 : -1)
    const randomY = Math.pow(Math.random(), DEFAULT_PARAMS.randomPower) * (Math.random() < 0.5 ? 1 : -1)
    const randomZ = Math.pow(Math.random(), DEFAULT_PARAMS.randomPower) * (Math.random() < 0.5 ? 1 : -1)

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

    const mixedColor = insideColor.clone()
    mixedColor.lerp(outsideColor, radius / DEFAULT_PARAMS.radius)
    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  if (galaxy !== null) {
    scene.remove(galaxy)
    galaxyGeometry.dispose()
    galaxyMaterial.dispose()
  }

  galaxyGeometry = new THREE.BufferGeometry()
  galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  galaxyMaterial = new THREE.PointsMaterial({
    size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  })
  galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial)
  scene.add(galaxy)
}

generateGalaxy()

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
camera.position.z = 6
camera.position.y = 3
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

  //   // Update particles
  //   for (let i = 0; i < count; i++) {
  //     const i3 = i * 3
  //     const x = particlesGeometry.attributes.position.array[i3]
  //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
  //   }
  //   particlesGeometry.attributes.position.needsUpdate = true

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
