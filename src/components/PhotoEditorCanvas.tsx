import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image, Rect, Transformer, Group } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import { useSubstrate } from './SubstrateProvider';

type CanvasProps = {
  path: string;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const PhotoEditorCanvas = ({ path }: CanvasProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [image] = useImage(path);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const imageGroupRef = useRef<Konva.Group>(null);
  const { substrateHeight, substrateWidth } = useSubstrate();

  const SUBSTRATE_X = (CANVAS_WIDTH - substrateWidth) / 2;
  const SUBSTRATE_Y = (CANVAS_HEIGHT - substrateHeight) / 2;


  // Render image on load
  useEffect(() => {
    if (isImageLoaded && imageRef.current && trRef.current && imageGroupRef.current) {
      trRef.current.nodes([imageGroupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isImageLoaded]);

  // Set image size and position on change
  useEffect(() => {
    if (image && imageGroupRef.current) {
      const aspectRatio = image.width / image.height;
      let newWidth = substrateWidth;
      let newHeight = substrateWidth / aspectRatio;

      if (newHeight > substrateHeight) {
        newHeight = substrateHeight;
        newWidth = substrateHeight * aspectRatio;
      }

      imageGroupRef.current.width(newWidth);
      imageGroupRef.current.height(newHeight);
      imageGroupRef.current.x(SUBSTRATE_X + (substrateWidth - newWidth) / 2);
      imageGroupRef.current.y(SUBSTRATE_Y + (substrateHeight - newHeight) / 2);

      if (imageRef.current) {
        imageRef.current.width(newWidth);
        imageRef.current.height(newHeight);
        imageRef.current.x(0);
        imageRef.current.y(0);
      }
    }
  }, [image, substrateHeight, substrateWidth]);

  const boundBoxFunc = (oldBox: any, newBox: any) => {
    const maxWidth = substrateWidth;
    const maxHeight = substrateHeight;
    
    if (newBox.width > maxWidth || newBox.height > maxHeight) {
      return oldBox;
    }
    
    return newBox;
  };

  return (
    <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
      <Layer>
        <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#212121" />
        <Rect x={SUBSTRATE_X} y={SUBSTRATE_Y} width={substrateWidth} height={substrateHeight} fill="#f5f5f5" />
        {image && (
          <>
            <Group
              ref={imageGroupRef}
              draggable={true}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            >
              <Image
                ref={imageRef}
                image={image}
                onLoad={() => setIsImageLoaded(true)}
                
              />
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