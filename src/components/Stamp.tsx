import * as React from 'react';
import * as browser from 'bowser';
import { Image, Transformer } from 'react-konva';
import { stampStore } from '../store/stampStore';

interface Props {
  image: HTMLImageElement
}

interface State {
  selected: boolean;
}

interface HandlerProps {
  name: string
}

class Handler extends React.Component<HandlerProps> {
  transformer: any;

  constructor (props: HandlerProps) {
    super(props);
  }

  componentDidMount() {
    if (!this.transformer) return;
    const stage = this.transformer.getStage();
    const rectangle = stage.findOne('.' + this.props.name);
    if (!rectangle) return;
    this.transformer.attachTo(rectangle);
    this.transformer.getLayer().batchDraw();

  }
  render() {
    return (
      <Transformer
        anchorSize={browser.mobile ? 40 : 15}
        ref={node => {
          this.transformer = node;
        }}
      />
    );
  }
}

export class Stamp extends React.Component<Props, State> {
  name: string;

  constructor (props: Props) {
    super(props);
    this.name = 'masawada-stamp-' + Date.now();
    this.state = {
      selected: false
    }
  }

  componentDidMount () {
    stampStore.on('readyForCapture', () => {
      this.setState({selected: false})
    });
  }

  selected () {
    this.setState({
      selected: !this.state.selected
    })
  }

  render () {
    const defaultHeight = window.innerHeight * 0.35;
    return (
      <>
        <Image name={this.name} image={this.props.image} draggable
          height={defaultHeight}
          width={this.props.image.naturalWidth * defaultHeight / this.props.image.naturalHeight}
          onClick={ () => this.selected()}
          onTouchStart={() => this.selected()}/>
        {
          this.state.selected && <Handler name={this.name}/>
        }
      </>
    )
  }
}
