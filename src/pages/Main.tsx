import ChatViewer from '../components/ChatViewer'

function Main() {
  return (
    <ChatViewer
    roomName="공개채팅방"
    chatTitle='개발자 대기실'
    serverPath='/topic/public'
    clientPath='/app/chat/public'
    />
  )
}

export default Main