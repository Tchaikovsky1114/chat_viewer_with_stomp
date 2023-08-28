import React, { SyntheticEvent, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { convertDatetime } from '../util/convertDatetime';
import useSocket, { Message } from '../hooks/useSocket';
import IdChangeConfirmModal from './IdChangeConfirmModal';
import useToggle from '../hooks/useToggle';
import useInput from '../hooks/useInput';
import UserContext from '../context/UserContext';

const checkIncludeHyperLink = (item:string) => {
  switch(true)
  {
    case item.includes('https://'):
      return 'https://'

    case item.includes('http://'):
      return 'http://'

    case item.includes('www.'):
      return 'www.'

    default:
      return '';
  }
}

const generateHyperLink = (item:string) => {
  if(item.length <= 2) return <span className='text-base text-white' >{item}<br /></span>

  const protocol = checkIncludeHyperLink(item);
  const link = item.split(protocol)[1].split(' ')[0];

  const hyperLinkText = protocol
  ? <p key={item}>
      <span className='text-base text-white'>{item.split(protocol)[0]}</span>
      <a
        className='text-indigo-500 text-sm'
        href={(protocol === 'http://' ? `http://${link}` : `https://${link}`)}
        target="_blank"
        rel="noopener noreferrer">
          🥝링크 ➡︎ {link}
      </a>
      <span className='text-base text-white'>{item.split(protocol)[1].split(' ').splice(1).join().replaceAll(',',' ')}</span>
    </p>
  : <span key={item + 'link'} className='text-base text-white' >{item}<br /></span>
  
  return hyperLinkText;
}

interface Props {
  serverPath?: string;
  clientPath?: string;
  roomName: string;
  chatTitle: string;
}

interface ChatUserInfo {
  name: string;
  token: string;
}

function ChatViewer({chatTitle, roomName, serverPath = '/topic/public', clientPath = '/app/chat'}:Props) {
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  const { userId, setUserId, chatToken } = useContext(UserContext);
  
  const { onToggle:onToggleIdChangeModal, toggle:isIdChangeModalShow } = useToggle();
  const { onChange:onChangeUserIdValue, value:changeUserId } = useInput();
  const {publish,chat,clearChat,totalNum,userList,} = useSocket({
        serverPath,
        clientPath,
        excuteBeforeComponentMount: [() => {
          publish({
            destination: `${clientPath}/join`,
            body: {
              token: chatToken,
              name: userId
            }
          });
        }]
    });
  

  const onShowIdChangeModal = () => {
    onToggleIdChangeModal(); 
  }
  
  // change id method: do notify to server
  const onSendMessage = (e:SyntheticEvent) => {
    if(!message.trim()) return;
    if(!userId) return alert('익명 = 필밴 ㅇㅈ?')
      e.preventDefault();
      publish<Message>({
        destination: clientPath,
        body: {
          username:userId,
          content:message,
          date: new Date().toISOString(),
          to:'',
          from: chatToken
        }
        });
      setMessage('');
  }


  const onChange = (e:SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setMessage(target.value);
  }

  const onEnterMessageSubmit = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(!message.trim()) return;
    if(e.keyCode === 13 && !e.shiftKey) {
      onSendMessage(e);
    }
  }

  const onSubmitChangeUserId = () => {
    publish<ChatUserInfo>({
      destination: `${clientPath}/changeId`,
      body: {token: chatToken, name: changeUserId}
      });
    setUserId(changeUserId);
    onToggleIdChangeModal(); 
  }


  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    if(textAreaRef.current) {
      textAreaRef.current.focus();
    }
  },[])

  useEffect(() => {

    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      publish({
        destination: `${clientPath}/disconnect`,
        body: chatToken
      });
    });
    return () => {
      publish({
        destination: `${clientPath}/disconnect`,
        body: chatToken
      });
    };
  },[chatToken,clientPath,publish])

  return (
    <>
     {isIdChangeModalShow && <IdChangeConfirmModal value={changeUserId} onChange={onChangeUserIdValue} onSubmit={onSubmitChangeUserId} />}
    <h1 className='text-2xl text-white w-full text-center p-1 mx-auto'>{roomName}</h1>
    
    <div className='flex gap-2 px-4'>
          <div className='flex-[0.85]'>
            <div className='w-full relative'>
              <div ref={chatBoxRef} className='relative w-[90%] bg-slate-400 mx-auto min-h-[400px] max-h-[400px] overflow-y-auto mt-2 shadow-md shadow-rose-600 rounded-lg border-2 border-rose-200 py-10 px-2'>
                  <h1 className='w-full h-2 text-right sticky top-1 right-0 text-gray-200'>{chatTitle}</h1>
                    {
                      chat.length > 0 && chat.map((item) => (
                      <div key={item.date} className='w-full bg-slate-400 flex items-start justify-start py-2 '>
                        <p className='text-gray-200 pl-2 text-xl'>
                          <span>
                            {item.username}
                          </span>
                          <span className='text-xs text-gray-300'>
                            ({convertDatetime(item.date)})
                          </span>
                          : {
                              item.content.length <= 1
                              ? <span key={item.date} className='text-base text-white'>
                                {item.content.trim()}
                                </span>
                              : item.content?.split('\n').map((item) => generateHyperLink(item))
                            }
                          </p>
                      </div>
                      ))
                    }
                  {
                  chat.length > 10 && <div className='w-full h-full flex items-end justify-end'>
                  <button onClick={clearChat} className='sticky w-28 h-8 text-base border-2 font-bold p-2 box-border text-white hover:text-indigo-400 flex items-center justify-center'>채팅기록 삭제</button>
                  </div>
                  }
              </div>
        
        <form onSubmit={onSendMessage} className='w-[90%] mx-auto mt-10 flex items-center gap-1'>
          <textarea ref={textAreaRef} className='w-full h-12 p-2' placeholder='write your message...' cols={10} value={message} onChange={onChange} onKeyDown={onEnterMessageSubmit} />
          <button type='button' onClick={onSendMessage} className='bg-white p-2 shadow-md shadow-gray-400 ring-1 ring-red-400 rounded-full w-12 h-12 font-bold text-indigo' onSubmit={onSendMessage}>입력</button>
        </form> 

      </div>
    </div>
      <div className='relative flex-[0.15] rounded-lg overflow-hidden flex flex-col justify-start items-center border-2 border-rose-400 bg-slate-200 p-2 box-border max-h-[600px]'>
        <p className='font-bold'>참여한인원({totalNum})</p>
        {
          userList.length > 0 && userList.map((item, index) => (
            <p key={index} className='text-indigo-500 text-sm'>
              <button>{item.name}</button> 
            </p>
          ))
        }

        <button className='p-3 bg-indigo-700 absolute bottom-0 right-0 bg-opacity-70 text-white font-bold shadow-md shadow-indigo-400' onClick={onShowIdChangeModal}>닉네임 변경하기</button>
      </div>
    </div> 
    </>
  )
}

export default React.memo(ChatViewer);