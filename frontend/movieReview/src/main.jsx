import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css'; // 이 라인을 추가합니다.
import router from './routes.jsx';

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
);