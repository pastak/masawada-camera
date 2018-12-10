import * as React from "react";
import { stampStore } from "../store/stampStore";

interface Props {
  onShowHelp: () => void;
}

interface State {
  imageData: string[];
  timer: number | null;
}

export class Capture extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      imageData: [],
      timer: null
    }
  }

  capture () {
    const canvas = document.createElement('canvas');
    const imageData = Array.from(this.state.imageData);
    const origins = [document.querySelector('#cameraCanvas'), document.querySelector('.konvajs-content canvas')] as HTMLCanvasElement[];
    canvas.width = origins[0].width;
    canvas.height = origins[0].height;
    const context = canvas.getContext('2d');

    origins.forEach((origin) => {
      context.drawImage(origin, 0, 0, origin.width, origin.height, 0, 0, canvas.width, canvas.height)
    })

    imageData.unshift(canvas.toDataURL());
    this.setState({
      imageData,
      timer: null
    })
  }

  readyForCapture () {
    if (this.state.timer) return;
    stampStore.readyForCapture()
    requestAnimationFrame(() => requestAnimationFrame(() => this.captureTimer(0)));
  }

  captureTimer (timer: number) {
    if (timer === 0) return this.capture();
    window.setTimeout(() => {
      this.setState({timer});
      this.captureTimer(timer - 1);
    }, 1000)
  }

  showhelp = () => {
    this.props.onShowHelp()
  }

  clear = () => {
    stampStore.clear();
  }

  render () {
    return (
      <>
        <div className='shutter-button-wrapper'>
          <input type='button' value='Help' className='help-button' onClick={this.showhelp} />
          <input onClick={() => this.readyForCapture()} type='button' value={
            this.state.timer ?
              this.state.timer :
              '■'
          } className={`capture-button${this.state.timer ? '' : ' waiting'}`}
          />
          <input type='button' value='Reset' className='clear-button' onClick={this.clear} />
        </div>
        <div className='imageList'>
          <div>
            {
              this.state.imageData.map(data => <a key={data.substr(-20)} href={data}><img src={data} /></a>)
            }
          </div>
        </div>
      </>
    )
  }
}
