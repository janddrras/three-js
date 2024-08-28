import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

console.log(OrbitControls)

const sizes = { width: 800, height: 600 }
let cursor = { x: 0, y: 0 }

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
})

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
scene.add(cube1)

// perspective camera
const min = 0.1
const max = 1000
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, min, max)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 2
camera.lookAt(cube1.position)
scene.add(camera)

// orthographic camera
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)
// camera.position.x = 2
// camera.position.y = 2
// camera.position.z = 2
// camera.lookAt(cube1.position)
// scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  //
  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  //   camera.position.y = cursor.y * 5
  //   camera.lookAt(cube1.position)
  //
  //   // cube1.rotation.y = elapsedTime

  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
