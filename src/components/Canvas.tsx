import { useState, useMemo, useRef } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import Konva from 'konva';
import { useSubstrate } from './SubstrateProvider';
import { TransformableImage } from './TransformableImage';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const Canvas = () => {
  const { substrateHeight, substrateWidth } = useSubstrate();
  const [isSelected, setIsSelected] = useState(false);
  const canvasRef = useRef<Konva.Rect>();
  const substrateRef = useRef<Konva.Rect>();

  const { substrateX, substrateY } = useMemo(() => {
    return {
      substrateX: Math.round((CANVAS_WIDTH - substrateWidth) / 2),
      substrateY: Math.round((CANVAS_HEIGHT - substrateHeight) / 2)
    };
  }, [substrateWidth, substrateHeight]);

  return (
    <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
      <Layer>
        <Rect
          ref={canvasRef}
          x={0}
          y={0}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          fill="#212121"
          onClick={() => setIsSelected(false)}
        />
        <Rect 
          ref={substrateRef}
          x={substrateX}
          y={substrateY}
          width={substrateWidth}
          height={substrateHeight}
          fill="#f5f5f5"
          onClick={() => setIsSelected(false)}
        />
        <TransformableImage 
          isSelected={isSelected} 
          setIsSelected={setIsSelected} 
          canvasWidth={CANVAS_WIDTH}
          canvasHeight={CANVAS_HEIGHT}
        />
      </Layer>
    </Stage>
  );
};

export default Canvas;