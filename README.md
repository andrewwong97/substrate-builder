# substrate-builder

I am building a tool to help solve a domain-specific workflow problem for direct printing on substrates (phone cases, t-shirts, cups, and mugs).

This is really just a stripped down Photoshop, with quality-of-life (QoL) features to directly assist with this workflow. It is intended to specifically excel when embedded into e-commerce CMS to allow for user-orchestrated customization of product designs. For all self orchestrated workflows (i.e. bulk printing via Photoshop), this might not be the most effective tool.

At the moment, there is no backend set up (see issues tab). Frontend data is persisted via local storage, and most of the file state is manipulated in local state, not saved anywhere.

Image manipulation is done via React Konva, which is great for single canvas manipulations, but not great when you need a canvas on a canvas. As a food for thought, it may be better to rewrite some of this functionality and reduce dependencies.

# Changelog, in pictures

## V4

![July 10 2024 (1)](https://github.com/user-attachments/assets/c5303511-7526-4c1d-8200-033d75993f56)


## V3

![2024-07-01 21 07 11](https://github.com/andrewwong97/substrate-builder/assets/7339169/c7d2229c-878f-4ee3-9dd6-7c4953c42cf7)
![2024-07-01 21 06 34](https://github.com/andrewwong97/substrate-builder/assets/7339169/2e627dfe-bc7f-4ae0-8e4b-93b93abc6a46)

## V2
![2024-06-30 00 44 44](https://github.com/andrewwong97/sandbox/assets/7339169/6dba4f89-07c5-4cb7-a737-0bfa36cc83fb)


## V1
![2024-06-25 04 40 38](https://github.com/andrewwong97/sandbox/assets/7339169/ed504a22-5a37-4125-92d2-ebc75114be34)

## V0
<img width="1512" alt="image" src="https://github.com/andrewwong97/sandbox/assets/7339169/0173a0bd-cadc-4797-914e-f63515fa9465">

# Setup 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
