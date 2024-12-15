<img src="./assets/icon.png" width="30%" />

<div>
  <p>
    CircleChain uses <a href="https://electron.atom.io/">Electron</a>, <a href="https://facebook.github.io/react/">React</a>, <a href="https://github.com/reactjs/react-router">React Router</a>, <a href="https://webpack.js.org/">Webpack</a> and <a href="https://www.npmjs.com/package/react-refresh">React Fast Refresh</a>.
  </p>
</div>

## Introduction

### circlechain

This is the blockchain project which is the same as bitcoin, but it has more types than bitcoin which only has coins.

Circlechain has coin, identity and ownership 3 types asset.

Circlechain assets are mined by miners about in 600 seconds, and the success mined miner will be given 100,000 li coins, 1 ownership and 1 identity assets.

Circlechain is designed to be the running rule base of the virtual world. Please join us the make the virtual world real.

### circle-chain-desktop

This is the circlechain desktop application which is designed to running on the desktop. It supports MacOS and Windows binary distributions. For
Linux users please make the distribution from the source.

#### snapshots

- login

![login](https://d530encj0ljay.cloudfront.net/release/images/circle-chain/login.png)

- register

![register](https://d530encj0ljay.cloudfront.net/release/images/circle-chain/signup.png)

- home

![home](https://d530encj0ljay.cloudfront.net/release/images/circle-chain/home.png)

- wallet info

![wallet information](https://d530encj0ljay.cloudfront.net/release/images/circle-chain/wallet-info.png)

- create wallet

![create wallet](https://d530encj0ljay.cloudfront.net/release/images/circle-chain/create-wallet.png)

- mine block

![mine block](https://d530encj0ljay.cloudfront.net/release/images/circle-chain/mine-block.png)

- import wallet

![import wallet](https://d530encj0ljay.cloudfront.net/release/images/circle-chain/import-wallet.png)

- transaction

![transaction](https://d530encj0ljay.cloudfront.net/release/images/circle-chain/wallet-transaction.png)

- payment

![payment](https://d530encj0ljay.cloudfront.net/release/images/circle-chain/wallet-payment.png)

## Install

Using the node version: 16.15.0, please install node with this version.

Clone the repo and install dependencies:

```bash
## for Chinese Users
git clone --depth 1 --branch main git@gitee.com:lidh04/circle-chain-desktop.git circle-chain-desktop
## for Global Users
git clone --depth 1 --branch main git@github.com:lidh04/circle-chain-desktop.git circle-chain-desktop
cd circle-chain-desktop
npm install
```

## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

### error fix

```shell
ModuleNotFoundError: No module named 'distutils'
```

#### distutils package is removed in python version 3.12

It was deprecated in Python 3.10 by PEP 632 “Deprecate distutils module”. For projects still using distutils and cannot be updated to something else, the setuptools project can be installed: it still provides distutils.

use below command in your virtual environment

```shell
pip install setuptools # linux
```

OR

```shell
brew install python-setuptools  # macOS
```

OR

```shell
sudo apt install python3-setuptools
```

OR

if it doesn't work, you may need stay on Python < 3.12 until the package is supported.

OR

Sometimes, setuptools is installed but, you still need to upgrade:

```shell
pip install --upgrade setuptools
```

Python 3.12 does not come with a stdlib distutils module (changelog), because distutils was deprecated in 3.10 and removed in 3.12

You can still use distutils on Python 3.12 by installing setuptools.

Full migration advice : https://peps.python.org/pep-0632/#migration-advice

## Docs

Please referer to:

- [Intro on github](https://github.com/lidh04/circle-chain-desktop/tree/main/docs/intro.md)
- [Intro on gitee](https://gitee.com/lidh04/circle-chain-desktop/tree/main/docs/intro.md)

## Community

- Slack: circlechain

- QQ: 233098427

## Versions

- 4.7.2 optimize the UI performance and some background tasks improvements.

- 4.7.1 support mac arm64 and Windows mine block locally

- 4.7.0 support mine block locally and improved UI

- 4.6.0 initial version

## Donations

- SHC

## Backers

- SHC

## Sponsors

- SHC

## Maintainers

- lidh04
- dhoegreet
- jhtu0232
- dhoegreedy
- alexander.stack

## License

MIT © CircleChain
