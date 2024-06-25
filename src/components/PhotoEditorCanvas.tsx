import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image, Rect, Transformer, Group } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';

type CanvasProps = {
  path: string;
  height: number;
  width: number;
}

const PhotoEditorCanvas = ({ path, height, width }: CanvasProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showBoundBox, setShowBoundBox] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [image] = useImage(path);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const groupRef = useRef<Konva.Group>(null);

  const canvasWidth = 800;
  const canvasHeight = 600;

  const phoneCaseWidth = 250;
  const phoneCaseHeight = 450;
  const rect2X = (canvasWidth - phoneCaseWidth) / 2;
  const rect2Y = (canvasHeight - phoneCaseHeight) / 2;

  useEffect(() => {
    if (isImageLoaded && imageRef.current && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isImageLoaded]);

  useEffect(() => {
    if (image && groupRef.current) {
      const aspectRatio = image.width / image.height;
      let newWidth = phoneCaseWidth;
      let newHeight = phoneCaseWidth / aspectRatio;

      if (newHeight > phoneCaseHeight) {
        newHeight = phoneCaseHeight;
        newWidth = phoneCaseHeight * aspectRatio;
      }

      groupRef.current.width(newWidth);
      groupRef.current.height(newHeight);
      groupRef.current.x(rect2X + (phoneCaseWidth - newWidth) / 2);
      groupRef.current.y(rect2Y + (phoneCaseHeight - newHeight) / 2);

      if (imageRef.current) {
        imageRef.current.width(newWidth);
        imageRef.current.height(newHeight);
        imageRef.current.x(0);
        imageRef.current.y(0);
      }
    }
  }, [image, phoneCaseWidth, phoneCaseHeight, rect2X, rect2Y]);

  const boundBoxFunc = (oldBox: any, newBox: any) => {
    const maxWidth = phoneCaseWidth;
    const maxHeight = phoneCaseHeight;
    
    if (newBox.width > maxWidth || newBox.height > maxHeight) {
      return oldBox;
    }
    
    return newBox;
  };

  return (
    <Stage width={canvasWidth} height={canvasHeight}>
      <Layer>
        <Rect x={0} y={0} width={canvasWidth} height={canvasHeight} fill="#212121" />
        <Rect x={rect2X} y={rect2Y} width={phoneCaseWidth} height={phoneCaseHeight} fill="#f5f5f5" />
        {image && (
          <>
            <Group
              ref={groupRef}
              draggable={true}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            >
              <Image
                ref={imageRef}
                image={image}
                onLoad={() => setIsImageLoaded(true)}
                
              />
              {isDragging && <Rect
                width={groupRef.current?.width() || 0}
                height={groupRef.current?.height() || 0}
                stroke="#c0c0c0"
                dash={[10, 5]}
                strokeWidth={2}
                listening={false}
              />}
            </Group>
            {isImageLoaded && isDragging && (
              <Transformer
                ref={trRef}
                boundBoxFunc={boundBoxFunc}
                keepRatio={true}
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                boundingBoxFunc={(oldBox: any, newBox: any) => {
                  if (newBox.width < 10 || newBox.height < 10) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </>
        )}
      </Layer>
    </Stage>
  );
};

export default PhotoEditorCanvas;