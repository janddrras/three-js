import * as THREE from 'three'
import gsap from 'gsap'

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
scene.add(cube1)

const sizes = {
  width: 800,
  height: 600
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

// const clock = new THREE.Clock()

gsap.to(cube1.position, { duration: 1, delay: 1, x: 2 })
gsap.to(cube1.position, { duration: 1, delay: 2, x: 0 })

const tick = () => {
  // const elapsedTime = clock.getElapsedTime()

  // cube1.rotation.x = elapsedTime
  // cube1.rotation.y = elapsedTime / 2
  // cube1.position.y = Math.sin(elapsedTime)
  // cube1.position.x = Math.cos(elapsedTime)
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
