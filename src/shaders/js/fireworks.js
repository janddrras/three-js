import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'
import { gsap } from 'gsap'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

import fragmentShader from './glsl/fireworks/fragment.glsl'
import vertexShader from './glsl/fireworks/vertex.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

// Sky
const sky = new Sky()
sky.scale.setScalar(450000)
scene.add(sky)

const sun = new THREE.Vector3()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2)
}
sizes.resolution = new THREE.Vector2(sizes.width, sizes.height)

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1.5, 0, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

const skyParameters = {
  turbidity: 10,
  rayleigh: 3,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.95,
  elevation: -2.2,
  azimuth: 180,
  exposure: renderer.toneMappingExposure
}

const updateSky = () => {
  const uniforms = sky.material.uniforms
  uniforms['turbidity'].value = skyParameters.turbidity
  uniforms['rayleigh'].value = skyParameters.rayleigh
  uniforms['mieCoefficient'].value = skyParameters.mieCoefficient
  uniforms['mieDirectionalG'].value = skyParameters.mieDirectionalG

  const phi = THREE.MathUtils.degToRad(90 - skyParameters.elevation)
  const theta = THREE.MathUtils.degToRad(skyParameters.azimuth)

  sun.setFromSphericalCoords(1, phi, theta)

  uniforms['sunPosition'].value.copy(sun)

  renderer.toneMappingExposure = skyParameters.exposure
  renderer.render(scene, camera)
}

gui.add(skyParameters, 'turbidity', 0.0, 20.0, 0.1).onChange(updateSky)
gui.add(skyParameters, 'rayleigh', 0.0, 4, 0.001).onChange(updateSky)
gui.add(skyParameters, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(updateSky)
gui.add(skyParameters, 'mieDirectionalG', 0.0, 1, 0.001).onChange(updateSky)
gui.add(skyParameters, 'elevation', 0, 90, 0.1).onChange(updateSky)
gui.add(skyParameters, 'azimuth', -180, 180, 0.1).onChange(updateSky)
gui.add(skyParameters, 'exposure', 0, 1, 0.0001).onChange(updateSky)

updateSky()
/**
 * Test
 */
// const test = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial())
// scene.add(test)

/**
 * Fireworks
 *************************************************************************************
 */
const textures = [
  textureLoader.load('/textures/particles/1.png'),
  textureLoader.load('/textures/particles/2.png'),
  textureLoader.load('/textures/particles/3.png'),
  textureLoader.load('/textures/particles/4.png'),
  textureLoader.load('/textures/particles/5.png'),
  textureLoader.load('/textures/particles/6.png'),
  textureLoader.load('/textures/particles/7.png'),
  textureLoader.load('/textures/particles/8.png'),
  textureLoader.load('/textures/particles/9.png'),
  textureLoader.load('/textures/particles/10.png'),
  textureLoader.load('/textures/particles/11.png'),
  textureLoader.load('/textures/particles/12.png'),
  textureLoader.load('/textures/particles/13.png')
]

const createFirework = (attr) => {
  const { count, position, size, texture, radius, color } = attr
  const positionArray = new Float32Array(count * 3)
  positionArray.forEach((_, index) => {
    const i3 = index * 3
    const spherical = new THREE.Spherical(
      radius * 0.75 + Math.random() * 0.25,
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2
    )
    const position = new THREE.Vector3()
    position.setFromSpherical(spherical)
    positionArray[i3] = position.x
    positionArray[i3 + 1] = position.y
    positionArray[i3 + 2] = position.z
  })

  const sizesArray = new Float32Array(count)
  sizesArray.forEach((_, index) => (sizesArray[index] = Math.random()))

  const timeMultipliersArray = new Float32Array(count)
  timeMultipliersArray.forEach((_, index) => (timeMultipliersArray[index] = 1 + Math.random()))

  // Geometry
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1))
  geometry.setAttribute('aTimeMultiplier', new THREE.BufferAttribute(timeMultipliersArray, 1))

  // Material
  texture.flipY = false
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uSize: new THREE.Uniform(size),
      uResolution: new THREE.Uniform(sizes.resolution),
      uTexture: new THREE.Uniform(texture),
      uColor: new THREE.Uniform(color),
      uProgress: new THREE.Uniform(0)
    }
  })

  // Points
  const firework = new THREE.Points(geometry, material)
  firework.position.copy(position)

  // Animate
  gsap.to(material.uniforms.uProgress, {
    value: 1,
    duration: 3,
    ease: 'linear',
    onComplete: () => {
      scene.remove(firework)
      geometry.dispose()
      material.dispose()
    }
  })

  scene.add(firework)
}
const settings = {
  count: 100,
  position: new THREE.Vector3(),
  size: 0.5,
  texture: textures[10],
  radius: 1,
  color: new THREE.Color('#00ff00')
}

const createRandomFirework = (createFirework) => {
  const randomAttributes = {
    count: Math.round(400 + Math.random() * 1000),
    position: new THREE.Vector3((Math.random() - 0.5) * 2, Math.random(), Math.random() * 2 - 1),
    size: 0.1 + Math.random() * 0.2,
    texture: textures[Math.floor(Math.random() * textures.length)],
    radius: 0.5 + Math.random(),
    color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`)
  }
  createFirework(randomAttributes)
}

createRandomFirework(createFirework)
/**
 * Click
 *
 */
window.addEventListener('click', () => createRandomFirework(createFirework))

// ***********************************************************************************************************

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
