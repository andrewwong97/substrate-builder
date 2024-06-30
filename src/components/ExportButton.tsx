import React from 'react';
import '../styles/ExportButton.css';

interface ExportButtonProps {
    onClick: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onClick }) => {
    const handleClick = () => {
        // Handle something when the button is clicked
        onClick();
    };

    return (
        <button className="ExportButton" onClick={handleClick}>Export</button>
    );
};

export default ExportButton;