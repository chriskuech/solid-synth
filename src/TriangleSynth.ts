import {
  BoxGeometry,
  DoubleSide,
  EdgesGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  TetrahedronGeometry,
} from 'three'

export class TriangleSynth {
  public readonly mesh: Mesh

  private active = false
  private readonly activeMaterial = new MeshStandardMaterial({
    // color: 0xabe5fb,
    color: 0xffaa33,

    // emissive: 0xabe5fb,
    // emissiveIntensity: 0.0,
    metalness: 0.2,
    roughness: 1,
    opacity: 0.5,
    transparent: true,
    side: DoubleSide,
  })
  private readonly inactiveMaterial = new MeshBasicMaterial({
    color: 0x333333,
  })

  constructor(readonly x: number, readonly y: number) {
    const geometry = new TetrahedronGeometry()
    // const edgesGeometry = new EdgesGeometry(geometry)
    // const edgesMaterial = new MeshBasicMaterial({ color: 0x000000, opacity: , transparent: true })
    // const edgesMesh = new Mesh(edgesGeometry, edgesMaterial)

    this.mesh = new Mesh(geometry, this.active ? this.activeMaterial : this.inactiveMaterial)
    // this.mesh.add(edgesMesh)

    this.mesh.position.set(x, this.active ? 5 : -5, y)
    this.mesh.addEventListener('click', () => {
      this.active = !this.active
      this.mesh.material = this.active ? this.activeMaterial : this.inactiveMaterial
    })
  }

  update() {
    if (this.active) {
      this.mesh.rotation.x += 0.001 * Math.random()
      this.mesh.rotation.y += 0.001
      this.mesh.position.y = this.y + Math.sin(this.mesh.rotation.x) * 2
    } else {
      this.mesh.position.set(-5, -5, -5)
      this.mesh.position.y = -5
    }
  }
}
