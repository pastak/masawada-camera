import {EventEmitter2 as EventEmitter} from 'eventemitter2';

class StampStore extends EventEmitter {
  stamps: string[]
  
  constructor () {
    super();
    this.stamps = [];
  }

  getStamps () {
    return this.stamps;
  }

  addStamp (src: string) {
    this.stamps.push(src);
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
