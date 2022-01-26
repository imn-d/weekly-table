import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import ReactDOM from 'react-dom';

import { Demo } from './Demo';

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={<CircularProgress />}>
      <Demo />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
);
