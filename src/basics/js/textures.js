import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import colored from '../../static/textures/door/color.jpg'
import alpha from '../../static/textures/door/alpha.jpg'
import height from '../../static/textures/door/height.jpg'
import normal from '../../static/textures/door/normal.jpg'
import ambientOcclusion from '../../static/textures/door/ambientOcclusion.jpg'
import metalness from '../../static/textures/door/metalness.jpg'
import roughness from '../../static/textures/door/roughness.jpg'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// *****************************************************************************
// Textures
// const image = new Image()
// const texture = new THREE.Texture(image)
// image.src = img
//
// image.onload = () => {
//   texture.needsUpdate = true
// }

const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
  console.log('loadingManager: loading started')
}
loadingManager.onLoad = () => {
  console.log('loadingManager: loading finished')
}
loadingManager.onProgress = () => {
  console.log('loadingManager: loading progressing')
}
loadingManager.onError = () => {
  console.log('loadingManager: loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load(colored)
const alphaTexture = textureLoader.load(alpha)
const normalTexture = textureLoader.load(normal)
const ambientOcclusionTexture = textureLoader.load(ambientOcclusion)
const metalnessTexture = textureLoader.load(metalness)
const heightTexture = textureLoader.load(height)
const roughnessTexture = textureLoader.load(roughness)
colorTexture.colorSpace = THREE.SRGBColorSpace

// *****************************************************************************

let cursor = { x: 0, y: 0 }
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
})

let sizes = { width: window.innerWidth, height: window.innerHeight }
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
})

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ map: colorTexture })
)
scene.add(cube1)

const min = 0.1
const max = 1000
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, min, max)
camera.position.z = 2
camera.lookAt(cube1.position)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
