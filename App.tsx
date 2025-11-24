import React, { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { User, ViewState } from './types';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = () => {
    // Mock login
    setCurrentUser({
      name: '王欣然',
      avatar: 'https://picsum.photos/id/64/100/100'
    });
    setViewState(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewState(ViewState.LOGIN);
  };

  return (
    <>
      {viewState === ViewState.LOGIN && (
        <Login onLogin={handleLogin} />
      )}
      {viewState === ViewState.DASHBOARD && currentUser && (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;
