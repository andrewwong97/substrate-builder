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
      <PhotoEditorCanvas path={file ? URL.createObjectURL(file) : ''} />
      <MediaPicker onFileChange={handleFileChange} />
    </div>
  );
}

export default App;
