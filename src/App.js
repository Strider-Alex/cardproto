/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react'
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer'
import gameRule from './settings/game.json'
import serverInfo from './settings/server.json'
import Game from "./game";
import Board from "./board";
import DeckBuilder from "./deckBuilder";

const GameClient = Client({
  game: Game,
  board: Board,
  debug: false,
  multiplayer: SocketIO({ server: `${serverInfo.protocol}://${serverInfo.hostname}:${serverInfo.port}` }),
});

class App extends React.Component {
  state = { playerID: null };

  render() {
    if (this.state.playerID === null) {
      return (
        <div>
          <p>Play as</p>
          {
            [...Array(gameRule.player)].map((e, idx) => 
            <button key={idx} onClick={() => this.setState({ playerID: String(idx) })}>
              {`Player ${idx}`}
            </button>)
          }
        </div>
      );
    }
    return (
      <div>
        <GameClient playerID={this.state.playerID} />
      </div>
    );
  }
}

export default App;