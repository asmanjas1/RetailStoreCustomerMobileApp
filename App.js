import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './navigation/AuthContext';
import { ModalPortal } from "react-native-modals";

const App = () => {
  return(
    <AuthProvider>
      <AppNavigator />
      <ModalPortal />
    </AuthProvider>
  )
};

export default App;
