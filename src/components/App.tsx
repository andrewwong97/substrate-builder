import PhotoEditorCanvas from './PhotoEditorCanvas';

import '../styles/App.css';
import MediaActions from './MediaActions';

import { SubstrateProvider } from './SubstrateProvider';
function App() {

  return (
    <SubstrateProvider>
      <div className="App">
        <h1>Phone Case Builder</h1>
        <PhotoEditorCanvas />
        <MediaActions />
      </div>
    </SubstrateProvider>
  );
}

export default App;
