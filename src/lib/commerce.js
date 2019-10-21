import Commerce from '@chec.io/commerce';

const commercejsConfig = {
  axiosConfig: {
    headers: {
      "X-Chec-Agent": "commerce.js/v1"
    }
  }
}


export default new Commerce(process.env.REACT_APP_COMMERCEJS_PUBLIC_KEY, (process.env.NODE_ENV === 'development') ? true : false, commercejsConfig);
