import { Outlet } from 'react-router-dom';
import TopNavigation from './components/navigation/TopNavigation';

function App() {
  

  return (
      <div className='w-full bg-slate-600'>
        <TopNavigation />
        <Outlet />
      </div>
  );
}

export default App;
