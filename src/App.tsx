import { BrowserRouter } from 'react-router-dom';
import { CorridorView } from './components/CorridorView';

function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-full">
        <CorridorView />
      </div>
    </BrowserRouter>
  );
}

export default App;
