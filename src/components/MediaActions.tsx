import React, { useState } from 'react';
import { debounce } from 'lodash';

import MediaPicker from './MediaPicker';
import ExportButton from './ExportButton';
import { useSubstrate } from './SubstrateProvider';
import '../styles/MediaActions.css';


interface MediaActionsProps {}

const MediaActions: React.FC<MediaActionsProps> = () => {
    const [localSubstrateHeight, setLocalSubstrateHeight] = useState(450);
    const [localSubstrateWidth, setLocalSubstrateWidth] = useState(200);
    const { setSubstrateHeight, setSubstrateWidth } = useSubstrate();

    const debounceHeight = debounce((value: number) => setSubstrateHeight(value), 200);
    const debounceWidth = debounce((value: number) => setSubstrateWidth(value), 200);

    const handleSubstrateHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setLocalSubstrateHeight(value);
        debounceHeight(value);
    };

    const handleSubstrateWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setLocalSubstrateWidth(value);
        debounceWidth(value);
    };

    return (
        <div className="MediaActions">
            <MediaPicker />
            <ExportButton onClick={() => console.log('Exporting')} />
            <div className="HeightAndWidth">
                <label>Substrate Height</label>
                <input type="text" value={localSubstrateHeight} onChange={handleSubstrateHeightChange} placeholder='Height' />
                <label>Substrate Width</label>
                <input type="text" value={localSubstrateWidth} onChange={handleSubstrateWidthChange} placeholder='Width' />
            </div>
      </div>
    );
};

export default MediaActions;