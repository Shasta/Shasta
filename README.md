[![Follow](https://img.shields.io/twitter/follow/Filenation_io.svg?style=social&label=Follow)](https://twitter.com/ethshasta)

# Shasta Platform <img align="right" src="/logo.png" height="80px" />

_Decentralized Energy Network_

## Run on your own computer

If you would like to test Shasta on your own computer, please before check the needed dependencies are met:
-  Node 10
-  NPM 6.2.x
-  git
- Ganache GUI or Ganache CLI or any other Ethereum blockchain dev enviroment.

Clone the repository
```
git clone https://github.com/ShastaProject/Shasta.git
```

Go into the folder and download modules:
```
cd Shasta
npm install
```

Run your Ethereum dev enviroment, example with ganache-cli:
```
ganache-cli
```

Migrate contracts and run the web app in local at http://localhost:3000
```
npm run dev
```

Run the front-end pointing to Rinkeby network ShastaOS contracts
```
NODE_ENV=production npm run start
```

Make production build pointing to Rinkeby
```
NODE_ENV=production npm run build
```

## Contributors

We love pull requests from everyone. By participating in this project, you agree to abide by the thoughtbot
[code of conduct](https://thoughtbot.com/open-source-code-of-conduct)

Fork, then clone the repo:
Push to your fork and  [submit a pull request](https://github.com/alexsicart/Shasta/pull/new/master).
