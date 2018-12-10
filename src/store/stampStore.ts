import {EventEmitter2 as EventEmitter} from 'eventemitter2';

class StampStore extends EventEmitter {
  stamps: [string, number][]
  
  constructor () {
    super();
    this.stamps = [];
  }

  getStamps () {
    return this.stamps;
  }

  addStamp (src: string) {
    this.stamps.push([src, Date.now()]);
    this.emit('update')
  }

  readyForCapture () {
    this.emit('readyForCapture');
  }

  clear () {
    this.stamps = [];
    this.emit('update');
  }
}

export const stampStore = new StampStore();
