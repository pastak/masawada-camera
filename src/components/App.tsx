import * as React from "react";
import {Camera} from './Camera';
import {MasawadaStamps} from './MasawadaStamps';
import {Capture} from './Capture';

interface Props {masawadaImages: string[]}

interface State {showHelp: boolean, showAddHS: boolean}

export class App extends React.Component<Props, State> {
  installPromptEvent: Event & {prompt: Function} | null;

  constructor (props: Props) {
    super(props);
    this.state = {
      showHelp: true,
      showAddHS: false
    }
  }

  componentDidMount () {
    if (localStorage.getItem('visited')) {
      return this.setState({showHelp: false})
    } else {
      try {
        localStorage.setItem('visited', '1');
      } catch (e) {}
      this.showHelp();
    }
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.installPromptEvent = event as Event  & {prompt: Function};
      this.setState({showAddHS: true});
    })
  }

  showHelp = () => {
    this.setState({showHelp: true})
  }

  addHS = () => {
    if (!this.installPromptEvent) return;
    this.installPromptEvent.prompt();
    this.installPromptEvent = null;
  }

  render () {
    return (
    this.state.showHelp ?
    (<div className='help-wrapper'>
        <h1>masawada camera</h1>
        <p>
          @masawadaと一緒にどこでも写真を撮ろう!
        </p>
        <h2>masawadaを配置する</h2>
        <p>
          カメラ部分下のmasawada画像を押すと画面に表示されます。画面のmasawadaを移動させたり、選択することでリサイズも出来ます。
        </p>
        <h2>写真を撮る</h2>
        <p>
          真ん中の■ボタンを押すと3秒後に写真が撮れます
        </p>
        <h2>保存する</h2>
        <p>
          画面下の段に撮影した画像が表示されます。PCの場合は右クリックから、スマホの場合は長押しすることで保存できます。
          左側にある画像ほど新しい画像です。
        </p>
        <h2>Tips</h2>
        <p>
          オフラインでもmasawada cameraは動作します。
          {
            (() => {
              let t = 'ホーム画面に追加しませんか';
              return this.state.showAddHS
                ? <a onClick={this.addHS}>{t}</a>
                : t
            })()
          }？
        </p>
        <p style={{textAlign: 'center'}}>
          <button onClick={() => this.setState({showHelp: false})}>カメラを開く</button>
        </p>
        <p>
          推奨ハッシュタグ: <a href='https://twitter.com/search?f=tweets&q=%23masawada_camera' target='_blank'>#masawada_camera</a><br />
          何かあれば<a href='https://twitter.com/pastak' target='_blank'>@pastak</a>まで。<br />
          <a href='https://github.com/pastak/masawada-camera' target='_blank'>https://github.com/pastak/masawada-camera</a>
        </p>
      </div>) :
    <>
      <section id='camera'>
        <Camera />
      </section>
      <section id='stamps'>
        <MasawadaStamps images={this.props.masawadaImages} />
      </section>
      <Capture onShowHelp={this.showHelp} />
    </>)
  }
}
