import { useEffect, useState } from 'react'
import useAxios from './useAxios';


interface Response<T> {
  error: string | null;
  result_code: string;
  result_message: string;
  data: T;
}
interface ChatToken {
  chatToken: string;
}

function useAuth() {
  const [chatToken, setChatToken] = useState('');
  const { get } = useAxios();

  const getChatToken = async () => {
    try {
      const data = await get<Response<ChatToken>>('/api/chat/token');
      setChatToken(data.data.chatToken);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getChatToken();
  },[])

  return { chatToken } 
}

export default useAuth