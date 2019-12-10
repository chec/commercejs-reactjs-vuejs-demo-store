import Commerce from '@chec/commerce.js';

const commercejsConfig = {
  axiosConfig: {
    headers: {
      "X-Chec-Agent": "commerce.js/v1"
    }
  },
  url: process.env.VUE_APP_CHEC_API_URL || 'https://api.chec.io'
}

export default new Commerce(
  process.env.VUE_APP_COMMERCEJS_PUBLIC_KEY,
  process.env.NODE_ENV === 'development',
  commercejsConfig
);
