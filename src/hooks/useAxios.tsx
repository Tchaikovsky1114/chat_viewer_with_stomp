import axios from 'axios';


const axiosInstance = axios.create({
  // baseURL: 'http://192.168.0.86:8080/',
  baseURL: 'http://192.168.219.110:8080/',
  timeout: 5000,
  headers: {'X-Custom-Header': 'life is agg..'},
});


interface Get {
  <T>(url:string, query?:string,params?:string): Promise<T>;
}


function useAxios() {
  

  const get:Get = async (url, query,params) => {
    try {
      const response = await axiosInstance.get(
        `${url}${query ? query : ''}`,
        { params });
      
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  return { get }
}

export default useAxios