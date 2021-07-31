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

  endTurn(e) {
    this.props.moves.endTurn();
    this.props.events.endTurn();
  }

  reset(e) {
    this.props.moves.resetGame();
  }

  throwDice0(e) {
      this.props.moves.throwDice0();
  }

  throwDice1(e) {
      this.props.moves.throwDice1();
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
        <button onClick={(e) => this.reset(e)}>Reset</button>
        <button onClick={(e) => this.endTurn(e)}>End Turn ({this.props.G.gameTurn})</button>
        <input class="dice_input_textbox" type="text" size="5" value={this.props.G.dice0Value} />
        <button onClick={(e) => this.throwDice0(e)}>Dice 0</button>
        <input class="dice_input_textbox" type="text" size="5" value={this.props.G.dice1Value} />
        <button onClick={(e) => this.throwDice1(e)}>Dice 1</button>
        <BoardFields moves={this.props.moves} G={this.props.G} playerID={this.props.playerID}/>
        {winner}
      </div>
    );
  }
}

export default Board;