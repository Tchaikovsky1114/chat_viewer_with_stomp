import React from 'react'

function useToggle() {
  const [toggle, setToggle] = React.useState(false) ;

  const onToggle = () => {
    setToggle(prev => !prev);
  }
  return {toggle, onToggle}
}

export default useToggle