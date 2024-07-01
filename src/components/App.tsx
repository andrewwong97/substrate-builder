import Canvas from './Canvas';

import '../styles/App.css';
import MediaActions from './MediaActions';

import { SubstrateProvider } from './SubstrateProvider';
function App() {

  return (
    <SubstrateProvider>
      <div className="App">
        <h1>Substrate Builder</h1>
        <Canvas />
        <MediaActions />
      </div>
    </SubstrateProvider>
  );
}

export default App;
