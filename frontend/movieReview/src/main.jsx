import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
// import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css'; // 이 라인을 추가합니다.
import { Provider } from 'react-redux';
import store from './store.js';

import { RouterProvider } from 'react-router-dom';
import router from './routes/routes.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// 앱의 퍼포먼스 시간들을 분석하여 객체 형태로 보여주는 것
// 사용자들에게 편의를 제공하는 페이지나 컴포넌트는 아니므로 삭제해도 무방
// reportWebVitals();
