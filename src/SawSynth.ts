import { IcosahedronGeometry, Vec2 } from 'three'
import { Oscillator } from 'tone'
import { Synth } from './Synth'

export class SawSynth extends Synth {
  constructor(gridPosition: Vec2) {
    super(0xff0000, new IcosahedronGeometry(), gridPosition, new Oscillator(0, 'sawtooth'))
  }
}
