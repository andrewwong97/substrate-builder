import React, { useState } from 'react';
import { debounce } from 'lodash';

import MediaPicker from './MediaPicker';
import ExportButton from './ExportButton';
import { useSubstrate } from './SubstrateProvider';
import '../styles/MediaActions.css';

interface MediaActionsProps {
    handleFileChange: (uploaded: File) => void;
};

const MediaActions: React.FC<MediaActionsProps> = ({ handleFileChange }) => {
    const { substrateHeight, setSubstrateHeight, substrateWidth, setSubstrateWidth } = useSubstrate();
    const [debouncedHeight, setDebouncedHeight] = useState(substrateHeight);
    const [debouncedWidth, setDebouncedWidth] = useState(substrateWidth);

    const debouncedSetHeight = debounce((value: number) => setDebouncedHeight(value), 200);
    const debouncedSetWidth = debounce((value: number) => setDebouncedWidth(value), 200);

    const handleSubstrateHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setSubstrateHeight(value);
        debouncedSetHeight(value);
    };

    const handleSubstrateWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setSubstrateWidth(value);
        debouncedSetWidth(value);
    }

    return (
        <div className="MediaActions">
            <MediaPicker onFileChange={handleFileChange} />
            <ExportButton onClick={() => console.log('Exporting')} />
            <div className="HeightAndWidth">
                <label>Substrate Height</label>
                <input type="text" value={substrateHeight} onChange={handleSubstrateHeightChange} placeholder='Height' />
                <label>Substrate Width</label>
                <input type="text" value={substrateWidth} onChange={handleSubstrateWidthChange} placeholder='Width' />
            </div>
      </div>
    );
};

export default MediaActions;