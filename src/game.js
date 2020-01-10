/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
import gameRule from './settings/game.json';
import cardInfo from './settings/card.json';

function IsVictory(cells) {
    return false;
}

const Game = {
    name: gameRule.name,

    setup: () => {
        let G = {
            fields: {}
        };
        const fields = gameRule.fields;
        for (let field in fields)
        {
            G.fields[field] = fields[field];
            G.fields[field].items = [];
        }
        const setup = gameRule.setup;
        let counter = 0;
        for (let field in setup) {
            for(let card in setup[field].items) {
                for (let i = 0; i<setup[field].items[card]; i++) {
                    G.fields[field].items.push({
                        id: `card-${counter++}`,
                        card: card
                    });
                }
            }
        }
        return G;
    },

    moves: {
        updateField(G, ctx, field, items) {
            G.fields[field] = items;
        }
    },

    //turn: { moveLimit: 1 },

    endIf: (G, ctx) => {
        if (IsVictory(G.cells)) {
            return { winner: ctx.currentPlayer };
        }
    }
};

export default Game;
