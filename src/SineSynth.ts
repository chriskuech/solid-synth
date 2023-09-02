import { BoxGeometry, SphereGeometry, Vec2 } from 'three'
import { Synth } from './Synth'
import { Oscillator } from 'tone'

export class SineSynth extends Synth {
  constructor(gridPosition: Vec2) {
    super(0xfdff7e, new SphereGeometry(), gridPosition, new Oscillator(0, 'sine'))
  }
}
