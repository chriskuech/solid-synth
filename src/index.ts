import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Texture } from 'three'

// Setup canvas, scene, camera, and renderer
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.y = 3
camera.position.z = 10

const renderer = new THREE.WebGLRenderer()
const controls = new OrbitControls(camera, renderer.domElement)

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Fog
scene.fog = new THREE.FogExp2(0xffffff, 0.005)

// Add helpers
scene.add(new THREE.GridHelper())
scene.add(new THREE.AxesHelper(10))

// Add light sources
;(() => {
  const pointLight = new THREE.PointLight(undefined, 100)
  pointLight.position.set(3, 4, 10)
  scene.add(pointLight)

  const ambientLight = new THREE.AmbientLight(0xffffff) // soft white light
  scene.add(ambientLight)
})()

// Add main cube
const cube = (() => {
  const geometry = new THREE.BoxGeometry()

  const material = new THREE.MeshStandardMaterial({
    color: 0xabe5fb,
    emissive: 0xabe5fb,
    emissiveIntensity: 0.3,
    metalness: 0.9,
    roughness: 1,
    opacity: 0.5,
    transparent: true,
    side: THREE.DoubleSide,
  })

  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  return cube
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

// Add postprocessing
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(
  new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.8, // strength
    0.3, // radius
    0.1, // threshold
  ),
)

// Animation loop
const animate = () => {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01 * Math.random()
  cube.rotation.y += 0.01 * Math.random()

  controls.update()
  composer.render()
}

animate()
