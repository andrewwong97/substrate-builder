import { useRef, useEffect, useState, useMemo } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Transformer, Group } from 'react-konva';
import Konva from 'konva';
import { useSubstrate } from './SubstrateProvider';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const DEFAULT_SUBSTRATE_HEIGHT = 450;
const DEFAULT_SUBSTRATE_WIDTH = 200;

const PhotoEditorCanvas = () => {
  const { substrateHeight, substrateWidth, file } = useSubstrate();
  const [image, setImage] = useState<HTMLImageElement>();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showTransformControls, setShowTransformControls] = useState(false);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const imageGroupRef = useRef<Konva.Group>(null);

  const [substrateX, setSubstrateX] = useState((CANVAS_WIDTH-DEFAULT_SUBSTRATE_WIDTH)/2);
  const [substrateY, setSubstrateY] = useState((CANVAS_HEIGHT-DEFAULT_SUBSTRATE_WIDTH)/2);
  
  // Load image into state when file changes
  useEffect(() => {
    if (!!file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      setImage(img);
      setIsImageLoaded(true);
    } else {
      setIsImageLoaded(false);
    }
  }, [file]);

  // Render image into the canvas
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

      const substrate_x = (CANVAS_WIDTH - substrateWidth) / 2;
      const substrate_y = (CANVAS_HEIGHT - substrateHeight) / 2;
      setSubstrateX(substrate_x);
      setSubstrateY(substrate_y);
      
      imageGroupRef.current.width(newWidth);
      imageGroupRef.current.height(newHeight);
      imageGroupRef.current.x(substrate_x + (substrateWidth - newWidth) / 2);
      imageGroupRef.current.y(substrate_y + (substrateHeight - newHeight) / 2);

      if (imageRef.current) {
        imageRef.current.width(newWidth);
        imageRef.current.height(newHeight);
        imageRef.current.x(0);
        imageRef.current.y(0);
      }
    }
  }, [image, substrateHeight, substrateWidth]);

  return (
    <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
      <Layer>
        <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#212121" />
        <Rect x={substrateX} y={substrateY} width={substrateWidth} height={substrateHeight} fill="#f5f5f5" />
        {image && (
          <>
            <Group
              ref={imageGroupRef}
              draggable={true}
              onDragStart={() => setShowTransformControls(true)}
              onDragEnd={() => setShowTransformControls(false)}
            >
              <KonvaImage
                ref={imageRef}
                image={image}
                onLoad={() => setIsImageLoaded(true)}
              />
            </Group>
            {isImageLoaded && (
              <Transformer
                ref={trRef}
                boundBoxFunc={(oldBox: any, newBox: any) => {
                  if (newBox.width > CANVAS_WIDTH || newBox.height > CANVAS_HEIGHT) {
                    return oldBox;
                  }   
                  return newBox;
                }}
                keepRatio={true}
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                resizeEnabled={true}
                rotateEnabled={false}
                rotateLineVisible={true}
              />
            )}
          </>
        )}
      </Layer>
    </Stage>
  );
};

export default PhotoEditorCanvas;