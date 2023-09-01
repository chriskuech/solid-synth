import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { SquareSynth } from './SquareSynth'
import { TriangleSynth } from './TriangleSynth'

// Setup canvas, scene, camera, and renderer
const scene = new THREE.Scene()
const bodies: { update: () => void }[] = []

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.y = 3
camera.position.z = 10

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const composer = new EffectComposer(renderer)

document.body.appendChild(renderer.domElement)

// Fog
scene.fog = new THREE.FogExp2(0xffffff, 0.005)

// Add helpers
const controls = new OrbitControls(camera, renderer.domElement)
scene.add(new THREE.GridHelper())
scene.add(new THREE.AxesHelper(10))

// Add light sources
;(() => {
  const pointLight = new THREE.PointLight(undefined, 1000)
  pointLight.position.set(3, 4, 10)
  scene.add(pointLight)

  const ambientLight = new THREE.AmbientLight(0xffffff) // soft white light
  scene.add(ambientLight)
})()

// Add bodies
;(() => {
  const squareSynth = new SquareSynth(-5, -5)
  scene.add(squareSynth.mesh)
  bodies.push(squareSynth)

  const triangleSynth = new TriangleSynth(-5, -4)
  scene.add(triangleSynth.mesh)
  bodies.push(triangleSynth)
  // squareSynth.mesh.dispatchEvent()
})()

// Add floor
;(() => {
  return
  const geometry = new THREE.PlaneGeometry(10, 10)
  const material = new THREE.MeshPhongMaterial({ color: 0x000000 })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotateX(-Math.PI / 2)
  mesh.position.y = -5
  scene.add(mesh)
})()

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const onMouseClick = (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    const object = intersects.find((o) => !o.object.type.endsWith('Helper'))?.object
    object?.dispatchEvent({ type: 'click' })
    console.log('Mesh clicked:', object)
  }
}

window.addEventListener('click', onMouseClick, false)

// Add postprocessing
;(() => {
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(
    new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1, // strength
      0.7, // radius
      0.1, // threshold
    ),
  )
})()

// Animation loop
const animate = () => {
  requestAnimationFrame(animate)

  bodies.forEach((body) => body.update())
  controls.update()
  composer.render()
}

animate()
