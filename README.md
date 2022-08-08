# feature-probe-demo-ui
FeatureProbe Demo UI
# Demo Website

This demo page supports users to directly experience the core features of FeatureProbe without setting up a docker environment.

## Requirements

Click [Demo](https://xxx.io/) to enter the demo page, and follow the task requirements on the demo page to operate the feature toggles on the FeatureProbe platform, and view the results on the demo page.

### Installation

```
npm install
```

### Local Development for English Version

```
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Local Development for Chinese Version

```
$ npm run start -- --locale zh-CN
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

```
$ npm run deploy
```
