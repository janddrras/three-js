import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

const gui = new GUI({ width: 300, title: 'Debug UI', closeFolders: true })
const debugObject = {}

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

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

debugObject.color = '#0a407b'
debugObject.spin = () => gsap.to(cube1.rotation, { y: cube1.rotation.y + Math.PI * 2, duration: 1 })
debugObject.subdivision = 2
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: debugObject.color })
)
scene.add(cube1)

// GUI
gui.hide()
window.addEventListener('keydown', (event) => (event.key === 'g' ? gui.show(gui._hidden) : null))

const folder = gui.addFolder('Cube tweaks')

folder.add(cube1.position, 'y').min(-3).max(3).step(0.01).name('cube1 y')
folder.add(cube1.position, 'x').min(-3).max(3).step(0.01).name('cube1 x')
folder.add(cube1.position, 'z').min(-3).max(3).step(0.01).name('cube1 z')
folder.add(cube1, 'visible').name('cube1 visible')
folder.add(cube1.material, 'wireframe').name('wireframe')
folder
  .addColor(debugObject, 'color')
  .name('cube1 color')
  .onChange(() => {
    cube1.material.color.set(debugObject.color)
  })
folder.add(debugObject, 'spin').name('spin cube1')
folder
  .add(debugObject, 'subdivision')
  .min(0)
  .max(20)
  .step(1)
  .name('subdivision')
  .onFinishChange(() => {
    const sd = debugObject.subdivision
    cube1.geometry.dispose()
    cube1.geometry = new THREE.BoxGeometry(1, 1, 1, sd, sd, sd)
  })

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 2
camera.lookAt(cube1.position)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

const tick = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
