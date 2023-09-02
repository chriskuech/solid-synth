import { TetrahedronGeometry, Vec2 } from 'three'
import { Oscillator } from 'tone'
import { Synth } from './Synth'

export class TriangleSynth extends Synth {
  constructor(gridPosition: Vec2) {
    super(0xffaa33, new TetrahedronGeometry(), gridPosition, new Oscillator(0, 'triangle'))
  }
}
