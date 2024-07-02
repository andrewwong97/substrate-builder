import { useRef, useEffect, useState, useMemo } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Transformer, Group } from 'react-konva';
import Konva from 'konva';
import { useSubstrate } from './SubstrateProvider';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const Canvas = () => {
  const { substrateHeight, substrateWidth, file } = useSubstrate();
  const [image, setImage] = useState<HTMLImageElement>();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const imageGroupRef = useRef<Konva.Group>(null);
  const [isSelected, setIsSelected] = useState(false);
  
  // Load image into state when file changes
  useEffect(() => {
    setIsSelected(false);
    if (!!file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage(img);
      };
      setIsImageLoaded(true);
    } else {
      setImage(undefined);
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

      const substrateX = Math.round((CANVAS_WIDTH - substrateWidth) / 2);
      const substrateY = Math.round((CANVAS_HEIGHT - substrateHeight) / 2);

      imageGroupRef.current.width(defaultImageWidth);
      imageGroupRef.current.height(defaultImageHeight);
      imageGroupRef.current.x(substrateX + (substrateWidth - defaultImageWidth) / 2);
      imageGroupRef.current.y(substrateY + (substrateHeight - defaultImageHeight) / 2);

      if (imageRef.current) {
        imageRef.current.width(defaultImageWidth);
        imageRef.current.height(defaultImageHeight);
        // X and Y are relative to the parent, which would be the group here
        imageRef.current.x(0);
        imageRef.current.y(0);
      }
    }
  }, [image, substrateHeight, substrateWidth]);

  const { substrateX, substrateY } = useMemo(() => {
    return {
      substrateX: Math.round((CANVAS_WIDTH - substrateWidth) / 2),
      substrateY: Math.round((CANVAS_HEIGHT - substrateHeight) / 2)
    };
  }, [substrateWidth, substrateHeight]);

  const handleSelect = () => {
    setIsSelected(true);
  };

  const handleDeselect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Deselect when clicking outside the image
    const clickedOnEmpty = e.target !== imageGroupRef.current && e.target !== imageRef.current;
    if (clickedOnEmpty) {
      setIsSelected(false);
    }
  };

  return (
    <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
      <Layer>
        <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#212121" onClick={handleDeselect} />
        <Rect x={substrateX} y={substrateY} width={substrateWidth} height={substrateHeight} fill="#f5f5f5" onClick={handleDeselect} />
        {image && isImageLoaded && (
          <>
            <Group
              ref={imageGroupRef}
              draggable={true}
              onClick={handleSelect}
              onTap={handleSelect}
              onDragStart={handleSelect}
              onDragEnd={() => setIsSelected(false)}
            >
              <KonvaImage
                ref={imageRef}
                image={image}
                onLoad={() => setIsImageLoaded(true)}
              />
            </Group>
            {isSelected && <Transformer
                ref={trRef}
                nodes={[imageGroupRef.current]}
                boundBoxFunc={(oldBox: any, newBox: any) => {
                  if (newBox.width > CANVAS_WIDTH || newBox.height > CANVAS_HEIGHT) {
                    return oldBox;
                  }   
                  return newBox;
                }}
                keepRatio={true}
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                resizeEnabled={true}
                rotateEnabled={true}
                rotateLineVisible={true}
                rotationSnaps={[0, 45, 90, 180]}
              /> 
            }
          </>
        )}
      </Layer>
    </Stage>
  );
};

export default Canvas;