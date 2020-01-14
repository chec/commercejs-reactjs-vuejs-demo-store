import Commerce from '@chec/commerce.js';

export default new Commerce(
  process.env.REACT_APP_COMMERCEJS_PUBLIC_KEY,
  process.env.NODE_ENV === 'development'
);
