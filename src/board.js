/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './board.css';
import BoardFields from "./boardFields";

class Board extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isMultiplayer: PropTypes.bool,
  };

  /*onClick = id => {
    if (this.isActive(id)) {
      this.props.moves.clickCell(id);
    }
  };

  isActive(id) {
    if (!this.props.isActive) return false;
    if (this.props.G.cells[id] !== null) return false;
    return true;
  }*/

  endTurn(e) {
    this.props.events.endTurn();
  }

  reset(e) {
    this.props.moves.resetGame();
  }

  render() {
    let winner = null;
    if (this.props.ctx.gameover) {
      winner =
        this.props.ctx.gameover.winner !== undefined ? (
          <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
        ) : (
            <div id="winner">Draw!</div>
          );
    }

    return (
      <div>
        <button onClick={(e)=>this.reset(e)}>Reset</button>
        <button onClick={(e)=>this.endTurn(e)}>End Turn</button>
        <BoardFields moves={this.props.moves} G={this.props.G} playerID={this.props.playerID}/>
        {winner}
      </div>
    );
  }
}

export default Board;