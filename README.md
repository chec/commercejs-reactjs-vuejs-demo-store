# Demo store using Commerce.js and Vue.js

This demo-store uses [Commerce.js](https://github.com/chec/commerce.js), an eCommerce client-side
JavaScript SDK.

## Spin up a local demo

Here are some instructions for how to spin up a local demo with seeded products in your own
[Chec Dashboard](http://dashboard.chec.io/).

### Use [Chec CLI](https://github.com/chec/cli)

Use the Chec CLI to create copy of source code on your local computer. First follow the instructions
to [install the Chec CLI](https://github.com/chec/cli#usage).

Once installed login using the `Chec login` command.
Then run the `Chec demo-store` command and select the `vue-shoe-store`.

If authenticated successfully (tip: use `Chec whoami`) your Chec dashboard should now include two
sample products, seeded by the Chec CLI, and a demo store directory in your root.

### Clone & use NPM script `seed`

You can also skip the use of the `Chec CLI` and instead clone the repo, switch to the `vue.js` branch, make a copy of
`.env.example` into `.env`—setting the variables needed. You must specify your secret key in the `.env`
for the `seed` script to have the proper permission to seed your Chec Dashboard with the sample product
data. Please remove the secret key when not in use anymore.

Once you have the proper `.env` keys run `yarn install` then `yarn seed`—and when ready to start the
application `yarn start`.

## Other Branches
  - `React.js`
    - Contains an abstracted version of the Master branch using React.js, Redux, CSS/SASS, JSX
  - `Master` (not ready)
    - Contains a plain HTML/CSS/SASS/Vanilla JS implementation.
