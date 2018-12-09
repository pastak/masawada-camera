import * as React from "react";
import { stampStore } from "../store/stampStore";

interface Props {
  images: string[];
}

export const MasawadaStamps =  (props: Props) => {
  return (
    <div>
      {
        props.images.map(imgSrc => <img
          onClick={() => stampStore.addStamp('/static/images/' + imgSrc)}
          src={'/static/images/' + imgSrc} />)
      }
    </div>
  )
}
