import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image, Rect } from 'react-konva';
import useImage from 'use-image';

type CanvasProps = {
  path: string;
}
const PhotoEditorCanvas = ({path}: CanvasProps) => {
  const [image] = useImage(path);

  return (
    <Stage width={800} height={600}>
      <Layer>
        { image && <Image image={image} x={0} y={0} /> }
        <Rect x={100} y={100} width={50} height={50} fill="red" />
      </Layer>
    </Stage>
  );
};

export default PhotoEditorCanvas;
