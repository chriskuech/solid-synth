import { BoxGeometry, Vec2 } from 'three'
import { Synth } from './Synth'
import { Oscillator } from 'tone'

export class SquareSynth extends Synth {
  constructor(gridPosition: Vec2) {
    super(0x7777ff, new BoxGeometry(), gridPosition, new Oscillator(0, 'square'))
  }
}
