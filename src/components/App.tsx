import React, { useState } from 'react';
import '../styles/App.css';
import MediaPicker from './MediaPicker';
import PhotoEditorCanvas from './PhotoEditorCanvas';

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
      <MediaPicker onFileChange={handleFileChange} />
    </div>
  );
}

export default App;
