import Commerce from '@chec/commerce.js';

const commercejsPublicKey = process.env.REACT_APP_COMMERCEJS_PUBLIC_KEY;
const isDevMode = process.env.NODE_ENV === 'development';
if (isDevMode && !commercejsPublicKey) {
  throw Error('You must provide your public API key as an environment variable named REACT_APP_COMMERCEJS_PUBLIC_KEY for Commerce.js to work. Your public key is available within your Chec dashboard, or can be obtained with the Chec CLI via "whoami')
}
export default new Commerce(
  commercejsPublicKey,
  isDevMode
);
