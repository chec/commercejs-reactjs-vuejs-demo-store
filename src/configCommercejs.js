import Commerce from '@chec/commerce.js';

const commercejsPublicKey = process.env.VUE_APP_COMMERCEJS_PUBLIC_KEY;
const isDevMode = process.env.NODE_ENV === 'development';
if (isDevMode && !commercejsPublicKey) {
  throw Error('You must provide your public API key as an environment variable named VUE_APP_COMMERCEJS_PUBLIC_KEY for Commerce.js to work. Your public key is available within your Chec dashboard.')
}
export default new Commerce(
  process.env.VUE_APP_COMMERCEJS_PUBLIC_KEY,
  process.env.NODE_ENV === 'development'
);
