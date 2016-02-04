
import {Component, View} from 'angular2/core';
@Component({
  selector: 'counter',
  properties: [
    'counter',
    'increment',
    'decrement',
    'incrementIfOdd',
    'incrementAsync'
  ]
})
@View({
  template: `
  <div>
    <h3>Clicked: {{ counter }} times</h3>
    <button class="btn btn-success" (click)="increment()">+</button>
    <button class="btn btn-danger" (click)="decrement()">-</button>
    <button class="btn btn-info" (click)="incrementIfOdd()">
      Increment if odd
    </button>
    <button class="btn btn-warning" (click)="incrementAsync()">
      Increment async
    </button>
  </div>
  `
})
export class Counter {
}
