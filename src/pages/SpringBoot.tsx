import React from 'react'
import ChatViewer from '../components/ChatViewer'

function SpringBoot() {
  return (
      <ChatViewer
      roomName='About Spring Boot ...'
      chatTitle='Spring Boot 개발자 토크방'
      serverPath='/topic/springboot'
      clientPath='/app/chat/springboot'
      
      />
  )
}

export default SpringBoot