import axios from 'axios'
import {useCallback, useEffect, useState} from 'react'

function useIp() {
  const [ip, setIp] = useState<string>('');

  const getIp = useCallback(async () => {
    try {
      const {data} = await axios.get('https://geolocation-db.com/json');  
      setIp(data.IPv4);
    } catch (error) {
      setIp('illigal user');
      
    }
  },[])

  useEffect(() => {
    getIp();
  },[])

  return {ip}
}

export default useIp