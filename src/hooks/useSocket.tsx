
import { useCallback, useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import {Client, StompSubscription} from '@stomp/stompjs';
import UserContext from '../context/UserContext';


// serverPath: subscribe, clientPath: publish 
interface Props {
  serverPath: string;
  clientPath: string;
  excuteBeforeComponentMount: (() => void)[];
}
export interface Message {
  username: string;
  content: string;
  date: string;
  to?: string;
  from?: string;
} 
interface PublishConfig<T> {
  destination: string;
  body: T ;
  headers?: Record<string, string>;
}

interface User {
  name: string;
  token: string;
}

type Subscribe = (path:string, callback:() => void) => void;
type Publish = <T>({destination, body, headers}:PublishConfig<T>) => void;

let socket: Client;

const subscriptions: Record<string,StompSubscription> = {};

function useSocket({serverPath, clientPath, excuteBeforeComponentMount}:Props) {
  const { chatToken } = useContext(UserContext);
  const [chat, setChat] = useState<Message[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [totalNum, setTotalNum] = useState(0);
  

  const clearChat = useCallback(() => {
    setChat([]);
  },[])
  
  const generateSocket = (token:string) => {
    
    socket = new Client({
      // webSocketFactory: () => new SockJS('http://192.168.0.86:8080/ws'),
      webSocketFactory: () => new SockJS('http://192.168.219.110:8080/ws'),
      // debug: (str) => {
      //   console.log(str)
      // },
      connectHeaders: {
        login: token,
        passcode: token,
        something: 'anything'
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 3000,
      heartbeatOutgoing: 30000,
    })
    socket.onConnect = (frame) => {
      socket.subscribe(serverPath,(message) => {
        
        // console.log('=== Session Id is ... ===', message.headers)
        const payload = JSON.parse(message.body);
        if(payload.username) setChat((prev) => [...prev, {content:payload.content, username:payload.username, date:payload.date}]);
      });
      
      // 유저 접속 채널
      
      socket.subscribe(`${serverPath}/join`,(message) => {
        console.log(`===${serverPath}: userList is... ===`, Object.values(JSON.parse(message.body)));
        
        setUserList(Object.values(JSON.parse(message.body)));
      });

      socket.subscribe(`${serverPath}/userlist`,(message) => {
        console.log(`===${serverPath}: userList is... ===`, Object.values(JSON.parse(message.body)));
        setUserList(Object.values(JSON.parse(message.body)));
      });

      // 인포메세지 채널
      socket.subscribe(`${serverPath}/infoMessage`,(message) => {
        // console.log('=== Session Id is ... ===', message)
        const payload = JSON.parse(message.body);
        console.log('disconnect payload:', message.body);
        setUserList((prev) => prev.filter((user) => user !== payload.prevUser));
      });
  
      // 접속한 유저 수 채널
      socket.subscribe(`${serverPath}/usercount`,(message) => {
        // console.log('=== Session Id is ... ===', message.headers)
        const payload = JSON.parse(message.body);
        console.log('usercount payload:', message.body);
        setTotalNum(payload);
      });

      // 유저 연결 해제 채널
      socket.subscribe(`${serverPath}/disconnect`,(message) => {
        console.log('=== Session Id is ... ===', message.headers)
        const payload = JSON.parse(message.body);
        // console.log('disconnect payload:', message.body);
        setUserList(payload);
      });

      // 귓속말 구독 채널
      socket.subscribe(`/queue/whisper`, (message) => {
        
        const payload = JSON.parse(message.body);
        console.log('whisper:', payload);
      });

      excuteBeforeComponentMount && excuteBeforeComponentMount.forEach((callback) => callback());
    }
  }

  const connect = useCallback((ct:string) => {
    generateSocket(ct);
    socket.activate();
  },[])

  
  const subscribe:Subscribe = useCallback((path,callback) => {
    if(!socket || subscriptions[path]) return;
    callback();
    subscriptions[path] = socket.subscribe(path, callback);
  },[]);

  const publish:Publish = useCallback(({destination, body, headers}) => {
    if(!socket) return;
    socket.publish({
      destination,
      body : typeof body === 'string'
            ? body 
            : JSON.stringify(body),
      headers
    });
  },[])


  useEffect(() => {
    if(!chatToken) return
    console.log('=== Chat Token ===',chatToken)
      connect(chatToken);
  },[chatToken]);




  return {subscribe,publish, chat, userList, totalNum, clearChat}
}

export default useSocket