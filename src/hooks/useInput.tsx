import React from 'react'

function useInput() {
  
  const [value, setValue] = React.useState('');

  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }
  
  return {value, onChange};
  
}

export default useInput