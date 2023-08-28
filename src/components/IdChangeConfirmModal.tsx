import React from 'react'


interface Props {
  value : string;
  onChange : (e:React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit : () => void;
}

function IdChangeConfirmModal({value, onChange, onSubmit}: Props) {
  
  return (
    <div className='absolute w-full bg-slate-400 bg-opacity-40 h-full z-[1000]'>
      <div className='w-1/4 h-1/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[60]'>
        <h1>변경하실 닉네임을 작성해주세요</h1>
          <input type="text" value={value} onChange={onChange} />
          <button onClick={onSubmit}>확인</button>
        
      </div>
    </div>
  )
}

export default IdChangeConfirmModal