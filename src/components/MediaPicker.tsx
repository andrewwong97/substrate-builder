import React, { ChangeEvent } from 'react';
import { useSubstrate } from './SubstrateProvider';

import '../styles/MediaPicker.css';

interface MediaPickerProps {
}
const MediaPicker: React.FC<MediaPickerProps> = () => {
    const { file, setFile } = useSubstrate();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const uploaded = event.target.files?.[0];
        if (!uploaded) {
            return;
        }
        setFile(uploaded);
    };

    return (
        <div className="MediaPicker">
            <label htmlFor="fileUpload" className="customFileUpload">Choose File</label>
            <input id="fileUpload" type="file" onChange={handleFileChange} />
            {file && <p className="fileName">{file.name}</p>}
        </div>
    );
};

export default MediaPicker;