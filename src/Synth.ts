import * as TWEEN from '@tweenjs/tween.js'
import { Tween } from '@tweenjs/tween.js'
import {
  ColorRepresentation,
  DoubleSide,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Vec2,
  BufferGeometry,
  Mesh,
  Vector3,
} from 'three'
import { Oscillator, LFO, Gain } from 'tone'
import { match } from 'ts-pattern'
import { sleep } from './util'

type State = 'activated' | 'deactivated' | 'activating' | 'deactivating'

export class Synth {
  private static readonly transitionPeriodInSeconds = 0.7
  private static readonly inactiveMaterial = new MeshBasicMaterial({
    color: 0x333333,
  })

  private readonly activeMaterial: MeshStandardMaterial
  public readonly mesh: Mesh

  private state: State = 'deactivated'
  private tween: TWEEN.Tween<Vector3> | null = null

  constructor(
    color: ColorRepresentation,
    geometry: BufferGeometry,
    gridPosition: Vec2,
    private readonly oscillator: Oscillator,
  ) {
    this.activeMaterial = new MeshStandardMaterial({
      color,
      metalness: 0.2,
      roughness: 1,
      opacity: 0.5,
      transparent: true,
      side: DoubleSide,
      dithering: true,
    })

    this.mesh = new Mesh(geometry, Synth.inactiveMaterial)
    this.mesh.position.set(gridPosition.x, -5, gridPosition.y)
    this.mesh.addEventListener('click', () => this.handleMouseClick())

    this.oscillator.toDestination()
    this.oscillator.start()

    const gainNode = new Gain(0.5).toDestination()

    // Connect oscillator to gain node
    this.oscillator.connect(gainNode)

    const lfo = new LFO({
      frequency: 2, // Speed of the modulation
      min: 0.0, // Minimum amplitude
      max: 0.9, // Maximum amplitude
    }).start()

    // Connect LFO to modulate gain
    lfo.connect(gainNode.gain)
  }

  update() {}

  activate() {
    console.log('activate')
    this.state = 'activating'
    this.mesh.material = this.activeMaterial

    this.oscillator.frequency.rampTo('Bb2', Synth.transitionPeriodInSeconds)

    this.tween?.stop()
    this.tween = new TWEEN.Tween(this.mesh.position)
      .to({ y: 5 }, Synth.transitionPeriodInSeconds * 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .chain(new Tween(this.mesh.rotation).to({ y: 2 * Math.PI }, 1000).repeat(Infinity))
      .start()

    sleep(Synth.transitionPeriodInSeconds * 1000).then(() => {
      this.state = 'activated'
    })
  }

  deactivate() {
    console.log('deactivate')
    this.state = 'deactivating'
    this.mesh.material = Synth.inactiveMaterial

    this.oscillator.frequency.rampTo(0, Synth.transitionPeriodInSeconds)

    this.tween?.stop()
    this.tween = new TWEEN.Tween(this.mesh.position)
      .to({ y: -5 }, Synth.transitionPeriodInSeconds * 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()

    sleep(Synth.transitionPeriodInSeconds * 1000).then(() => {
      this.state = 'deactivated'
    })
  }

  private handleMouseClick() {
    match(this.state)
      .with('activated', () => this.deactivate())
      .with('deactivated', () => this.activate())
  }
}
