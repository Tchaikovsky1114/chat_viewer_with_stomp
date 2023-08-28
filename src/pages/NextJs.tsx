import React from 'react'
import ChatViewer from '../components/ChatViewer'

function NextJs() {
  return (
      <ChatViewer
      roomName='About Next.js ...'
      chatTitle='Next.js 개발자 토크방'
      serverPath='/topic/nextjs'
      clientPath='/app/chat/nextjs'
      
      />
  )
}

export default NextJs