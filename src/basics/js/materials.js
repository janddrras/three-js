import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'

import doorUrl from '/textures/door/color.jpg'
import alphaUrl from '/textures/door/alpha.jpg'
import ambientOcclusionUrl from '/textures/door/ambientOcclusion.jpg'
import heightUrl from '/textures/door/height.jpg'
import metalnessUrl from '/textures/door/metalness.jpg'
import normalUrl from '/textures/door/normal.jpg'
import roughnessUrl from '/textures/door/roughness.jpg'
import matcapUrl from '/textures/matcaps/8.png'
import gradientUrl from '/textures/gradients/3.jpg'
import environmentMapUrl from '/textures/environmentMap/2k.hdr?url'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Debug
const gui = new GUI()

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

// Textures
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load(doorUrl)
const doorAlphaTexture = textureLoader.load(alphaUrl)
const doorAmbientOcclusionTexture = textureLoader.load(ambientOcclusionUrl)
const doorHeightTexture = textureLoader.load(heightUrl)
const doorMetalnessTexture = textureLoader.load(metalnessUrl)
const doorNormalTexture = textureLoader.load(normalUrl)
const doorRoughnessTexture = textureLoader.load(roughnessUrl)
const matcapTexture = textureLoader.load(matcapUrl)
const gradientTexture = textureLoader.load(gradientUrl)

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

// Materials
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide

// const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
// material.flatShading = true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 50
// material.specular = new THREE.Color(0x1188ff)

// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

// const material = new THREE.MeshStandardMaterial()
// material.metalness = 1
// material.roughness = 1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

const material = new THREE.MeshPhysicalMaterial()
material.metalness = 0
material.roughness = 0
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

// material.clearcoat = 1
// material.clearcoatRoughness = 0.2
// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001)
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001)

// material.sheen = 1
// material.sheenRoughness = 0.2
// material.sheenColor.set(1, 1, 1)
// gui.add(material, 'sheen').min(0).max(1).step(0.0001)
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.0001)
// gui.addColor(material, 'sheenColor')

// material.iridescence = 1
// material.iridescenceMap = doorColorTexture
// material.iridescenceIOR = 1
// material.iridescenceThicknessRange = [100, 800]

material.transmission = 1
material.ior = 1.5
material.thickness = 0.5
gui.add(material, 'transmission').min(0).max(1).step(0.0001)
gui.add(material, 'ior').min(0).max(10).step(0.0001)
gui.add(material, 'thickness').min(0).max(1).step(0.0001)

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material)
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material)
sphere.position.x = -2
plane.position.x = -0.25
torus.position.x = 1
scene.add(sphere, plane, torus)

// Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)
//
// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.set(2, 3, 4)
// scene.add(pointLight)

// Environment map
const rgbeLoader = new RGBELoader()
rgbeLoader.load(environmentMapUrl, (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap
  scene.environment = envMap
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

  // Update objects
  sphere.rotation.y = elapsedTime * 0.1
  plane.rotation.y = elapsedTime * 0.1
  torus.rotation.y = elapsedTime * 0.1

  sphere.rotation.x = elapsedTime * -0.15
  plane.rotation.x = elapsedTime * -0.15
  torus.rotation.x = elapsedTime * -0.15

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
