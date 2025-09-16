import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthDebug: React.FC = () => {
  const { state } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-sm max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div>Loading: {state.loading.toString()}</div>
      <div>Authenticated: {state.isAuthenticated.toString()}</div>
      <div>User: {state.user ? `${state.user.firstName} (${state.user.role})` : 'null'}</div>
      <div>Token: {state.token ? 'exists' : 'null'}</div>
      <div>Error: {state.error || 'none'}</div>
    </div>
  );
};

export default AuthDebug;