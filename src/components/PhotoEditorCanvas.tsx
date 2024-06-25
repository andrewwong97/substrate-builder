import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image, Rect } from 'react-konva';
import useImage from 'use-image';

type CanvasProps = {
  path: string;
  height: number;
  width: number;
}
const PhotoEditorCanvas = ({path, height, width}: CanvasProps) => {
  const [image] = useImage(path);

  const canvasWidth = 800; // Canvas width
  const canvasHeight = 600; // Canvas height

  const phoneCaseWidth = 250; // Width of the second rectangle
  const phoneCaseHeight = 450; // Height of the second rectangle
  const rect2X = (canvasWidth - phoneCaseWidth) / 2; // X position to center within the first rectangle
  const rect2Y = (canvasHeight - phoneCaseHeight) / 2; // Y position to center within the first rectangle
  // Calculate position to center the image horizontally
  const imageX = width / 2 - (image ? image.width / 2 : 0);
  const imageY = height / 2 - (image ? image.height / 2 : 0);

  return (
    <Stage className="PhotoEditorCanvas" width={canvasWidth} height={canvasHeight} >
      <Layer>
        {/* First Rectangle */}
        <Rect
          x={0}
          y={0}
          width={canvasWidth}
          height={canvasHeight}
          fill="#212121"
        />
      </Layer>
      <Layer>
        {/* Second Rectangle centered within the first rectangle */}
        <Rect
          x={rect2X}
          y={rect2Y}
          width={phoneCaseWidth}
          height={phoneCaseHeight}
          fill="#f5f5f5"
        />
      </Layer>
      <Layer>
      { image && 
      <Image 
        image={image} 
        x={imageX} 
        y={imageY} 
        height={phoneCaseWidth * image.height / image.width} 
        width={phoneCaseHeight * image.width / image.height} 
        opacity={0.7}
        draggable={true}/> }
      </Layer>
    </Stage>
  );
};

export default PhotoEditorCanvas;
