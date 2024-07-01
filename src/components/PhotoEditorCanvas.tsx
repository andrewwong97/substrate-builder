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
  
  // Load image into state when file changes
  useEffect(() => {
    if (!!file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage(img);
      };
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

  // Set default image size and position on substrate canvas input change or image change
  useEffect(() => {
    if (image && imageGroupRef.current) {
      const aspectRatio = image.width / image.height;
      const defaultImageWidth = Math.min(substrateWidth, substrateHeight * aspectRatio);
      const defaultImageHeight = defaultImageWidth / aspectRatio;

      
    
      const setImageProperties = (node: Konva.Node) => {
        const substrateX = Math.round((CANVAS_WIDTH - substrateWidth) / 2);
        const substrateY = Math.round((CANVAS_HEIGHT - substrateHeight) / 2);
        const centerX = substrateX + (substrateWidth - defaultImageWidth) / 2;
        const centerY = substrateY + (substrateHeight - defaultImageHeight) / 2;
        node.width(defaultImageWidth);
        node.height(defaultImageHeight);
        node.x(centerX);
        node.y(centerY);
      };
    
      setImageProperties(imageGroupRef.current);
    
      if (imageRef.current) {
        setImageProperties(imageRef.current);
      }
    }
  }, [image, substrateHeight, substrateWidth]);

  const { substrateX, substrateY } = useMemo(() => {
    return {
      substrateX: Math.round((CANVAS_WIDTH - substrateWidth) / 2),
      substrateY: Math.round((CANVAS_HEIGHT - substrateHeight) / 2)
    };
  }, [substrateWidth, substrateHeight]);


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
              onTap={() => setShowTransformControls(true)}
              onDragStart={() => setShowTransformControls(true)}
              onDragEnd={() => setShowTransformControls(false)}
            >
              <KonvaImage
                ref={imageRef}
                image={image}
                onSelect={() => setShowTransformControls(true)}
                onLoad={() => setIsImageLoaded(true)}
              />
            </Group>
            {isImageLoaded && showTransformControls && (
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