import React, { useState } from 'react';
import MediaPicker from './MediaPicker';
import PhotoEditorCanvas from './PhotoEditorCanvas';
import ExportButton from './ExportButton';
import { debounce } from 'lodash';

import '../styles/App.css';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [substrateHeight, setSubstrateHeight] = useState(450);
  const [substrateWidth, setSubstrateWidth] = useState(200);
  const [debouncedHeight, setDebouncedHeight] = useState(450);
  const [debouncedWidth, setDebouncedWidth] = useState(200);

  const handleFileChange = (uploaded: File) => {
    setFile(uploaded);
  };

  const debouncedSetHeight = debounce((value: number) => setDebouncedHeight(value), 200);
  const debouncedSetWidth = debounce((value: number) => setDebouncedWidth(value), 200);

  const handleSubstrateHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setSubstrateHeight(value);
    debouncedSetHeight(value);
  };

  const handleSubstrateWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setSubstrateWidth(value);
    debouncedSetWidth(value);
  }

  return (
    <div className="App">
      <h1>Phone Case Builder</h1>
      
      <PhotoEditorCanvas 
        path={file ? URL.createObjectURL(file) : ''} 
        substrateHeight={debouncedHeight}
        substrateWidth={debouncedWidth}
      />
      <br />
      <div className="MediaActions">
        <MediaPicker onFileChange={handleFileChange} />
        <ExportButton onClick={() => console.log('Exporting')} />
        <div className="HeightAndWidth">
          <label>Substrate Height</label>
          <input type="text" value={substrateHeight} onChange={handleSubstrateHeightChange} placeholder='Height' />
          <label>Substrate Width</label>
          <input type="text" value={substrateWidth} onChange={handleSubstrateWidthChange} placeholder='Width' />
        </div>
      </div>
    </div>
  );
}

export default App;
