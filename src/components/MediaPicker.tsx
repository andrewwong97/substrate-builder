import React, { ChangeEvent, useState, createContext } from 'react';

import '../styles/MediaPicker.css';

type MediaPickerProps = {
    onFileChange: (file: File) => void;
};

const MediaPicker: React.FC<MediaPickerProps> = ({ onFileChange }) => {
    const [file, setFile] = useState<File | null>();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const uploaded = event.target.files?.[0];
        if (!uploaded) {
            return;
        }
        setFile(uploaded);
        onFileChange(uploaded);
    };

    return (
        <div className="MediaPicker">
            <label htmlFor="fileUpload" className="customFileUpload">Choose File</label>
            <input id="fileUpload" type="file" onChange={handleFileChange} />
        </div>


    );
};

export default MediaPicker;