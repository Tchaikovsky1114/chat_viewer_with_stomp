export const convertDatetime = (date: string) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  const second = dateObj.getSeconds();
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  
  
  if (year === todayYear && month === todayMonth && day === todayDay) {
    return `${hour}:${minute === 0 ? '00' : minute}`;
  }else if(year === todayYear && month === todayMonth && day !== todayDay){
    return `${day}일 ${hour}:${minute === 0 ? '00' : minute}:${second}`;
  }else if(year !== todayYear){
  return `${year}/${month}/${day}`;
  } else {
    return `${year}/${month}/${day} ${hour}:${minute === 0 ? '00' : minute}`;
  }
}