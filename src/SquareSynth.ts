import { BoxGeometry, DoubleSide, Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three'

export class SquareSynth {
  public readonly mesh: Mesh

  private active = false
  private readonly activeMaterial = new MeshStandardMaterial({
    color: 0xabe5fb,
    emissive: 0xabe5fb,
    emissiveIntensity: 0.5,
    metalness: 0.9,
    roughness: 1,
    opacity: 0.5,
    transparent: true,
    side: DoubleSide,
  })
  private readonly inactiveMaterial = new MeshBasicMaterial({
    color: 0x333333,
  })

  constructor() {
    const geometry = new BoxGeometry()

    this.mesh = new Mesh(geometry, this.active ? this.activeMaterial : this.inactiveMaterial)

    this.mesh.position.set(0, 0, 0)
    this.mesh.addEventListener('click', () => {
      this.active = !this.active
      this.mesh.material = this.active ? this.activeMaterial : this.inactiveMaterial
    })
  }

  update() {
    if (this.active) {
      this.mesh.rotation.x += 0.001 * Math.random()
      this.mesh.rotation.y += 0.001
    } else {
      this.mesh.position.set(-5, -5, -5)
    }
  }
}
