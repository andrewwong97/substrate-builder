import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image, Rect, Transformer, Group } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';

type CanvasProps = {
  path: string;
  height: number;
  width: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const SUBSTRATE_WIDTH = 250;
const SUBSTRATE_HEIGHT = 450;

const PhotoEditorCanvas = ({ path, height, width }: CanvasProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [image] = useImage(path);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const groupRef = useRef<Konva.Group>(null);

 
  const SUBSTRATE_X = (CANVAS_WIDTH - SUBSTRATE_WIDTH) / 2;
  const SUBSTRATE_Y = (CANVAS_HEIGHT - SUBSTRATE_HEIGHT) / 2;

  // Render image on load
  useEffect(() => {
    if (isImageLoaded && imageRef.current && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isImageLoaded]);

  useEffect(() => {
    if (image && groupRef.current) {
      const aspectRatio = image.width / image.height;
      let newWidth = SUBSTRATE_WIDTH;
      let newHeight = SUBSTRATE_WIDTH / aspectRatio;

      if (newHeight > SUBSTRATE_HEIGHT) {
        newHeight = SUBSTRATE_HEIGHT;
        newWidth = SUBSTRATE_HEIGHT * aspectRatio;
      }

      groupRef.current.width(newWidth);
      groupRef.current.height(newHeight);
      groupRef.current.x(SUBSTRATE_X + (SUBSTRATE_WIDTH - newWidth) / 2);
      groupRef.current.y(SUBSTRATE_Y + (SUBSTRATE_HEIGHT - newHeight) / 2);

      if (imageRef.current) {
        imageRef.current.width(newWidth);
        imageRef.current.height(newHeight);
        imageRef.current.x(0);
        imageRef.current.y(0);
      }
    }
  }, [image, SUBSTRATE_WIDTH, SUBSTRATE_HEIGHT, SUBSTRATE_X, SUBSTRATE_Y]);

  const boundBoxFunc = (oldBox: any, newBox: any) => {
    const maxWidth = SUBSTRATE_WIDTH;
    const maxHeight = SUBSTRATE_HEIGHT;
    
    if (newBox.width > maxWidth || newBox.height > maxHeight) {
      return oldBox;
    }
    
    return newBox;
  };

  return (
    <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
      <Layer>
        <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#212121" />
        <Rect x={SUBSTRATE_X} y={SUBSTRATE_Y} width={SUBSTRATE_WIDTH} height={SUBSTRATE_HEIGHT} fill="#f5f5f5" />
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
              {/* Bounding box on drag */}
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