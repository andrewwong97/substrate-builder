import { Image as KonvaImage, Transformer, Group } from 'react-konva';
import Konva from 'konva';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSubstrate } from './SubstrateProvider';

interface TransformableImageProps {
    isSelected: boolean;
    setIsSelected: (value: boolean) => void;
    canvasWidth: number;
    canvasHeight: number;
}

export const TransformableImage: React.FC<TransformableImageProps> = ({ canvasHeight, canvasWidth, isSelected, setIsSelected }) => {
    const { substrateHeight, substrateWidth, file } = useSubstrate();
    const [image, setImage] = useState<HTMLImageElement>();
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const imageRef = useRef<Konva.Image>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const imageGroupRef = useRef<Konva.Group>(null);
    const [ imageHeight, setImageHeight ] = useState<number>(0);
    const [ imageWidth, setImageWidth ] = useState<number>(0);
    const [ isXCentered, setIsXCentered ] = useState<boolean>(false);
    const [ isYCentered, setIsYCentered ] = useState<boolean>(false);

    const handleSelect = useCallback(() => {
        setIsSelected(true);
    }, [setIsSelected]);

    const handleDeselect = useCallback(() => {
        setIsSelected(false);
    }, [setIsSelected]);

    // Load image into state when file changes
    useEffect(() => {
        handleDeselect();
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
    }, [file, handleDeselect, setIsImageLoaded, setImage]);

    // Render transformer
    useEffect(() => {
        if (isImageLoaded && imageRef.current && trRef.current && imageGroupRef.current) {
            trRef.current.nodes([imageGroupRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isImageLoaded]);

    // Set default image size and position on substrate canvas input change or image change
    useEffect(() => {
        handleDeselect();
        if (image && imageGroupRef.current) {
            const aspectRatio = image.width / image.height;
            const defaultImageWidth = Math.min(substrateWidth, substrateHeight * aspectRatio);
            const defaultImageHeight = defaultImageWidth / aspectRatio;

            const substrateX = Math.round((canvasWidth - substrateWidth) / 2);
            const substrateY = Math.round((canvasHeight - substrateHeight) / 2);

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
            setImageHeight(defaultImageHeight);
            setImageWidth(defaultImageWidth);
        }
    }, [image, substrateHeight, substrateWidth, canvasHeight, canvasWidth, handleDeselect]);

    const handleDragMove = useCallback((e: Konva.KonvaEventObject<Event>) => {
        const node = e.target as Konva.Node;
        const newPos = node.position();
        const centerX = newPos.x + imageWidth / 2;
        const centerY = newPos.y + imageHeight / 2;
        setIsXCentered(centerX === canvasWidth/2);
        setIsYCentered(centerY === canvasHeight/2);
    }, [canvasHeight, canvasWidth, substrateHeight, substrateWidth]);

    if (image && isImageLoaded) {
        return (
            <Group className="TransformableImage">
                <Group
                    ref={imageGroupRef}
                    draggable={true}
                    onClick={handleSelect}
                    onTap={handleSelect}
                    onDragStart={handleSelect}
                    onDragEnd={handleDeselect}
                    onDragMove={handleDragMove}
                >
                    <KonvaImage ref={imageRef} image={image} onLoad={() => setIsImageLoaded(true)} />
                </Group>
                {isSelected && (
                    <Transformer
                        ref={trRef}
                        nodes={[imageGroupRef.current]}
                        boundBoxFunc={(oldBox: any, newBox: any) => {
                            if (newBox.width > canvasWidth || newBox.height > canvasHeight) {
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
                )}
            </Group>
        );
    }
    return null;
};