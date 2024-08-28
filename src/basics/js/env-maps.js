import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader, GroundedSkybox } from 'three/examples/jsm/Addons.js'
import { RGBELoader } from 'three/examples/jsm/Addons.js'
import { EXRLoader } from 'three/examples/jsm/Addons.js'

const loader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbELoader = new RGBELoader()
const exrLoader = new EXRLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

scene.environmentIntensity = 1
scene.backgroundBlurriness = 0
scene.backgroundIntensity = 1
scene.backgroundRotation.y = 0

gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.01).name('Environment Intensity')
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.0001).name('Background Blurriness')
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001).name('Background Intensity')
gui
  .add(scene.backgroundRotation, 'y')
  .min(0)
  .max(2 * Math.PI)
  .step(0.001)
  .name('Background Rotation')

gui
  .add(scene.environmentRotation, 'y')
  .min(0)
  .max(2 * Math.PI)
  .step(0.001)
  .name('Environment Rotation')

/**
 * Environment maps
 *
 */

// const environmentMap = cubeTextureLoader.load([
//   '/environmentMaps/0/px.png',
//   '/environmentMaps/0/nx.png',
//   '/environmentMaps/0/py.png',
//   '/environmentMaps/0/ny.png',
//   '/environmentMaps/0/pz.png',
//   '/environmentMaps/0/nz.png'
// ])
// scene.background = environmentMap
// scene.environment = environmentMap

// rgbELoader.load('/environmentMaps/lights-2k.hdr', (envMap) => {
//   envMap.mapping = THREE.EquirectangularReflectionMapping
//   scene.background = envMap
//   scene.environment = envMap
// })

// exrLoader.load('/environmentMaps/nvidiaCanvas-4k.exr', (envMap) => {
//   envMap.mapping = THREE.EquirectangularReflectionMapping
//   scene.background = envMap
//   scene.environment = envMap
// })

// const envMap = textureLoader.load(
//   '/environmentMaps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg'
// )
// const envMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/fantasy_lands_castles_at_night.jpg')
// const envMap = textureLoader.load(
//   '/environmentMaps/blockadesLabsSkybox/digital_painting_neon_city_night_orange_lights_.jpg'
// )
// envMap.colorSpace = THREE.SRGBColorSpace
// envMap.mapping = THREE.EquirectangularReflectionMapping
// scene.background = envMap
// scene.environment = envMap

// rgbELoader.load('/environmentMaps/2/2k.hdr', (envMap) => {
//   envMap.mapping = THREE.EquirectangularReflectionMapping
//   scene.environment = envMap
//   const skybox = new GroundedSkybox(envMap, 15, 70)
//   skybox.position.y = 15
//   scene.add(skybox)
// })

/**
 * Real time environment maps
 *
 */

const envMap = textureLoader.load(
  '/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg'
)
envMap.colorSpace = THREE.SRGBColorSpace
envMap.mapping = THREE.EquirectangularReflectionMapping
scene.background = envMap

/**
 * Scene Lights
 *
 */
const glowingRing = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.5),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 10, 10) })
)
glowingRing.layers.enable(1)
glowingRing.position.y = 3.5
scene.add(glowingRing)

// cube render
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType })

scene.environment = cubeRenderTarget.texture
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 1, color: 0xaaaaaaa })
)
torusKnot.position.x = -4
torusKnot.position.y = 4
// scene.add(torusKnot)

/**
 * Models
 *
 */
loader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(10, 10, 10)
  scene.add(gltf.scene)
})

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
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
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
  // Time
  const elapsedTime = clock.getElapsedTime()

  // Real time environment maps
  if (glowingRing) {
    glowingRing.rotation.x = Math.sin(elapsedTime) * 2
    cubeCamera.update(renderer, scene)
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
