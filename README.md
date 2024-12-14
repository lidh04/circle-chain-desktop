<img src="./assets/icon.png" width="30%" />

<div>
  <p>
    CircleChain uses <a href="https://electron.atom.io/">Electron</a>, <a href="https://facebook.github.io/react/">React</a>, <a href="https://github.com/reactjs/react-router">React Router</a>, <a href="https://webpack.js.org/">Webpack</a> and <a href="https://www.npmjs.com/package/react-refresh">React Fast Refresh</a>.
  </p>
</div>

## Install

Using the node version: 16.15.0, please install node with this version.

Clone the repo and install dependencies:

```bash
git clone --depth 1 --branch main git@gitee.com:lidh04/circle-chain-desktop.git circle-chain-desktop
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

Please referer to [intro](https://gitee.com/lidh04/circle-chain-desktop/tree/main/docs/intro.md).

## Community

- slack: circlechain
- QQ: 233098427

## Versions

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
