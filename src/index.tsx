import ReactDOM from 'react-dom/client';
import './index.css';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import App from './App';
import PrivateChatRoom from './components/PrivateChatRoom';
import NextJs from './pages/NextJs';
import SpringBoot from './pages/SpringBoot';
import Main from './pages/Main';
import { UserProvider } from './context/UserContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router =  createBrowserRouter(
  createRoutesFromElements(
  <>
    <Route path="/" element={<App />}>
      <Route path="/" element={<Main />} />
      <Route path="/privatechat" element={<PrivateChatRoom />} />
      <Route path="/nextjs" element={<NextJs />} />
      <Route path="/springboot" element={<SpringBoot />} />
    </Route>
  </>
    
  )
)

root.render(
  <UserProvider >
    <RouterProvider router={router} />
  </UserProvider>
);
