import * as React from "react";
import { Stage, Layer } from 'react-konva';
import {Stamp} from './Stamp'
import { stampStore } from "../store/stampStore";

interface Props {}

interface State {
  setTimer: boolean;
  height: number;
  width: number;
  stamps: [HTMLImageElement, number][];
  imageData: string[];
  timer: number | null;
  enableCamera: boolean;
}

export class Camera extends React.Component<Props, State> {

  videoElement: HTMLVideoElement;
  canvasElement: HTMLCanvasElement;
  stream: MediaStream;

  constructor (props: Props) {
    super(props);

    this.state = {
      stamps: [],
      setTimer: false,
      width: 0,
      height: 0,
      imageData: [],
      timer: null,
      enableCamera: false
    };
  }

  componentDidMount () {
    this.setupCamera();
    stampStore.addListener('update', () => {
      (async () => {
        const stamps = await Promise.all(
          stampStore.getStamps().map(
            (item): Promise<[HTMLImageElement, number]> => new Promise(
              resolve => {
                const img = new (window as any).Image();
                img.onload = () => resolve([img, item[1]]);
                img.src = item[0];
              }
            )
          )
        )
        this.setState({stamps});
      })()
    })
  }

  componentDidUpdate () {
    this.setupCamera();
  }

 setupCamera = async () => {
    if (this.stream) return;
    try {
      if (!this.stream) this.stream = await navigator.mediaDevices.getUserMedia({
        audio:false,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 1024 },
          facingMode: {
            exact: 'environment'
          }
        }
      })
    } catch (e) {
      if (e.constraint === 'facingMode' && e.name === 'OverconstrainedError') {
        try {
          if (!this.stream) this.stream = await navigator.mediaDevices.getUserMedia({
            audio:false,
            video: true
          })
        } catch (e) {}
      }
    }
    if (!this.stream) return alert('カメラが有効になりませんでした');
    let cameraWidth: number, cameraHeight: number;
    this.videoElement.addEventListener('loadedmetadata', () => {
      if (this.state.setTimer) return;
      cameraHeight = window.innerHeight * 0.6;
      cameraWidth = window.innerWidth;
      
      this.canvasElement.width = cameraWidth;
      this.canvasElement.height = cameraHeight;
      
      let videoInputRect = {
        width: this.videoElement.videoWidth,
        height: this.videoElement.videoHeight
      }
      let videoWidth = Math.max(
        videoInputRect.width,
        cameraWidth
      );

      const drawImageArgs: [
        number, number,
        number, number,
        number, number,
        number, number
      ] = [
        0, 0,
        videoInputRect.width, videoInputRect.height,
        Math.floor((cameraWidth - videoWidth) / 2), 0,
        Math.floor(videoWidth), Math.floor(videoInputRect.height * videoWidth / videoInputRect.width)
      ];
      let ctx = this.canvasElement.getContext('2d');
      const renderingCanvas = () => requestAnimationFrame(() => {
        if (!this.stream) this.setupCamera();
        ctx = ctx || this.canvasElement.getContext('2d');
        ctx.drawImage(this.videoElement, ...drawImageArgs);
        renderingCanvas();
      })
      renderingCanvas();
      this.setState({
        setTimer: true,
        width: cameraWidth,
        height: cameraHeight
      });
    })
    this.videoElement.srcObject = this.stream;
  }

  render () {
    return (
      <>
        <Stage
          style={{
            marginLeft: ((window.innerWidth - this.state.width) / 2) + 'px'
          }}
          width={this.state.width}
          height={this.state.height}>
          <Layer>
            {
              this.state.stamps.map(item => <Stamp
                key={item[0].src + item[1]}
                image={item[0]}
              />)
            }
          </Layer>
        </Stage>
        <canvas ref={(elm) => this.canvasElement = elm}
          style={{
            marginLeft: ((window.innerWidth - this.state.width) / 2) + 'px'
          }}
          id='cameraCanvas'
        ></canvas>
        <video ref={(elm) => this.videoElement = elm} playsInline autoPlay muted />
      </>
    )
  }
}
