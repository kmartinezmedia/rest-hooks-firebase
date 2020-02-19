import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import RootProvider from './RootProvider';
import App from './App';

ReactDOM.render(
  <StrictMode>
    <RootProvider>
      <App />
    </RootProvider>
  </StrictMode>,
  document.body,
);
