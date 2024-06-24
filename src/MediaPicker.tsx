import React, { ChangeEvent, useState, createContext } from 'react';

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
        <div>
            <input type="file" onChange={handleFileChange} />
            {file && <p>Selected file: {file.name}</p>}
        </div>
    );
};

export default MediaPicker;