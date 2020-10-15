# Cardproto
Cardproto is a project that makes prototyping a card game easy for everyone!

## When is Cardproto Useful?
- You are creating your own card game (that's super cool!). Every couple of days you will come up with a few new cards but you don't want to print them out every time (they are subject to changes!)
- You are fine with your printer, but you don't want to ask a couple of friends to your place every week to test your cards. You want to test them online.
- You are developing your own online card game this time! You have a few new mechanism in mind and want to see how they work in your game. It would be super bad to write a few hundred lines of code for your new mechanism but ending up finding them improper for your game.

## What does Cardproto provide?
- A tool to fast prototype any card game without writing code.
- Online features to allow you and your friends to play the card game protoype together.
- Exporting your prototype into a real card game (in the future).

## A Simple Poker Game in Cardproto
Now imagine a (super) simple poker game for two players. Each player starts with five cards. Every turn they need to draw cards and discard a few according to certain rules. The first player who empty the hand wins the game.

With just a few settings (currently it's just a few lines of JSON, but we plan to provide a game builder in the future), we can come up with a game in Cardproto:

![Poker in Cardproto](https://raw.githubusercontent.com/Strider-Alex/github-images/master/cardproto/poker.png)

Note that player 0 only sees their own hand and the discard pile, and other information is hidden. 

The player can drag a card in hand to the discard pile. The other player can observe this change as well (now your game can be played online!):

![Drag card](https://raw.githubusercontent.com/Strider-Alex/github-images/master/cardproto/poker_drag.gif)

You may notice that the exact rule of this poker game is hidden from Cardproto. You need to use other ways to inform the player about what cards can be played each turn, what is the winning condition, etc. This may appears to be strange, but is the key feature that enable Cardproto to simulate almost all card games and save you from implementing the actual game logic while prototyping.

## More Complex Games

You may notice that in the previous poker game, the cards are stateless. What if the cards are stateful (e.g. Hearthstone)?

Currently, cardproto provides editable text fields associated on cards as a solution. You can record the card states in these text fields (e.g. The current HP and Attack for a minion).

## Getting Started
### Development
#### Setup
`npm install`

`npm i esm`

#### Start
`npm start`

`node -r esm src/server.js`

#### Update Your Game
Card information: `src/settings/card.json`

Game information: `src/settings/game.json`

Deck path: `src/settings/setup.json`

`pm2 restart server`
### Production
#### Setup
`npm install`

`npm i esm`

`npm install -g pm2`

#### Start
`pm2 start node_modules/react-scripts/scripts/start.js --name "client"`

`pm2 start src/server.js --node-args="-r esm" --name "server"`

Later, you can use

`pm2 start client`

`pm2 start server`

#### Update Deck and Card Information
Deck path: `src/settings/setup.json`

Card information: `src/settings/card.json`

After update these files, run

`pm2 restart server`