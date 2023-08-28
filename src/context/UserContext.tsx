import {createContext, useState } from 'react'
import useAuth from '../hooks/useAuth';


const UserContext = createContext({
  userId: '',
  setUserId: (userId:string) => {},
  chatToken: '',
});

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({children}:Props) => {
  const [userId, setUserId] = useState('어나니머스');
  const { chatToken } = useAuth();

  if(!chatToken) return <div>wait... get initial authentication...</div>
  return (
    <UserContext.Provider value={{chatToken, userId, setUserId}}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext;