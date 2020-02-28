This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup
`npm install`

`npm i esm`

`npm install -g pm2`

## Start
`pm2 start node_modules/react-scripts/scripts/start.js --name "client"`

`pm2 start src/server.js --node-args="-r esm" --name "server"`

Later, you can use

`pm2 start client`

`pm2 start server`

## Update Deck and Card Information
Deck path: `src/settings/setup.json`

Card information: `src/settings/card.json`

After update these files, run

`pm2 restart server`