import React, { useState } from 'react';
import '../styles/App.css';
import Renderer from './Renderer';
import MediaPicker from './MediaPicker';

function App() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (uploaded: File) => {
    setFile(uploaded);
  };

  return (
    <div className="App">
      <Renderer height={500} width={500} file={file ?? undefined}/>
      <MediaPicker onFileChange={handleFileChange} />
    </div>
  );
}

export default App;
