import React, { useState, createContext } from 'react';
import PhotoEditorCanvas from './PhotoEditorCanvas';

import '../styles/App.css';
import MediaActions from './MediaActions';

import { SubstrateProvider } from './SubstrateProvider';
function App() {
  const [file, setFile] = useState<File | null>(null);
  

  const handleFileChange = (uploaded: File) => {
    setFile(uploaded);
  };

  return (
    <SubstrateProvider>
      <div className="App">
        <h1>Phone Case Builder</h1>
        <PhotoEditorCanvas path={file ? URL.createObjectURL(file) : ''} />
        <br />
        <MediaActions handleFileChange={handleFileChange} />
      </div>
    </SubstrateProvider>
  );
}

export default App;
