import {
  AdditiveBlending,
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  Scene,
} from 'three'

export class SquareSynth {
  private readonly geometry: BoxGeometry

  constructor(scene: Scene) {
    const geometry = new BoxGeometry()

    const material = new MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      transparent: true,
      opacity: 0.8,
    })

    // const material = new MeshBasicMaterial()

    const cube = new Mesh(geometry, material)

    cube.position.set(0, 5, 0)

    scene.add(cube)
  }

  play() {}
}
