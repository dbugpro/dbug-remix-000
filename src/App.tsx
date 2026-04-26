import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Corridor } from './components/Corridor';

function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-full">
        <Corridor />
      </div>
    </BrowserRouter>
  );
}

export default App;
