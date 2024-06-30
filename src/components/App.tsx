import React, { useState } from 'react';
import MediaPicker from './MediaPicker';
import PhotoEditorCanvas from './PhotoEditorCanvas';
import ExportButton from './ExportButton';

import '../styles/App.css';

function App() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (uploaded: File) => {
    setFile(uploaded);
  };

  return (
    <div className="App">
      <h1>Phone Case Builder</h1>
      <PhotoEditorCanvas 
        path={file ? URL.createObjectURL(file) : ''} 
        height={600}
        width={800}
      />
      <br />
      <div className="MediaActions">
        <MediaPicker onFileChange={handleFileChange} />
        <ExportButton onClick={() => console.log('Exporting')} />
      </div>
    </div>
  );
}

export default App;
