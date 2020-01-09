/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
import gameRule from './settings/game.json';

function IsVictory(cells) {
    return false;
}

const Game = {
    name: gameRule.name,

    setup: () => ({
        cells: Array(9).fill(null)
    }),

    moves: {
        clickCell(G, ctx, id) {
            if (G.cells[id] === null) {
                G.cells[id] = ctx.currentPlayer;
            }
        }
    },

    //turn: { moveLimit: 1 },

    endIf: (G, ctx) => {
        if (IsVictory(G.cells)) {
            return { winner: ctx.currentPlayer };
        }
        if (G.cells.filter(c => c === null).length === 0) {
            return { draw: true };
        }
    }
};

export default Game;
