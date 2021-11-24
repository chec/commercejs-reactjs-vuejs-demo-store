# Demo store using Commerce.js & React

This demo-store uses [Commerce.js](https://github.com/chec/commerce.js), an eCommerce client-side 
JavaScript SDK.

[![](https://github.com/chec/commercejs-reactjs-vuejs-demo-store/blob/react.js/public/socsreact.png)](https://chec.github.io/commercejs-reactjs-vuejs-demo-store/#/)


[![Demo button](https://cdn.chec.io/email/assets/marketing/chec-demo-btn_gray.svg)](https://chec.github.io/commercejs-reactjs-vuejs-demo-store/#/)

# Spin up a local demo
Follow the instructions below to [install the Chec CLI](https://github.com/chec/cli#usage).

## Install source code using the [Chec CLI](https://github.com/chec/cli)
Use the Chec CLI to create copy of the source code on your computer. First follow the instructions to install the Chec CLI.

Once installed login using the Chec login command. Then run the Chec demo-store command and select the `react-shoe-store`.

If authenticated successfully (tip: use `chec whoami`) your Chec Dashboard should now include two sample products, seeded by the Chec CLI, and your terminal should have a `react-shoe-store` directory.

## Clone & use NPM script `seed`
You can also skip the use of the Chec CLI and instead clone the repo, switch to the `react.js` branch, make a copy of `.env.example` into `.env` and setting the variables needed. 

You must specifiy your secret key in the `.env` for the `seed` script to have the proper permission to seed your Chec Dashboard with the sample product data. Please remove the secret key when not in use anymore.

Once you have the proper `.env` keys run `yarn install` then `yarn seed`—and when ready to serve the application `yarn serve`.

## Other Branches
  - `Vue.js`
    - Contains an abstracted version of the Master branch using Vue.js CSS/SASS, templating syntax. [View here](https://github.com/chec/commercejs-reactjs-vuejs-demo-store/tree/vue.js)
  - `Master` (not ready)
    - Contains a plain HTML/CSS/SASS/Vanilla JS implemenation.
    
## ⚠️ Note

### This repository is no longer maintained
However, we will accept issue reports and contributions for this repository. See the [contribute to the commerce community](https://commercejs.com/docs/community/contribute) page for more information on how to contribute to our open source projects. For update-to-date APIs, please check the latest version of the [API documentation](https://commercejs.com/docs/api/).
