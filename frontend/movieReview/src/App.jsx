import React from 'react';

import { Outlet, RouterProvider } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';

function App() {
  return (
    <div>
      <NavigationBar />
      <main className="d-flex flex-column mt-4 flex-grow-1">
        <Outlet />
      </main>
    </div>
  );
}

export default App;