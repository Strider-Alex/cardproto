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

function numOfInstances(field) {
    if (field.owner === 'player') {
        return gameRule.player;
    }
    return 1;
}

function newKey(key, idx, n) {
    if (n > 1) {
        return `${key}-${idx}`;
    }
    return key;
}

function reset() {
    let G = {
        fields: {}
    };
    const fields = gameRule.fields;
    const setup = gameRule.setup;
    let counter = 0;
    for (let fieldKey in fields)
    {
        const n = numOfInstances(fields[fieldKey]);
        for (let idx=0; idx<n; idx ++) {
            const k = newKey(fieldKey, idx, n);
            G.fields[k] = fields[fieldKey];
            G.fields[k].items = [];
            // setup for each instance
            if (fieldKey in setup) {
                for(let card in setup[fieldKey].items) {
                    for (let i = 0; i<setup[fieldKey].items[card]; i++) {
                        G.fields[k].items.push({
                            id: `card-${counter++}`,
                            card: card
                        });
                    }
                }
            }
        }
    }
    /*for (let fieldKey in setup) {
        for(let card in setup[fieldKey].items) {
            for (let i = 0; i<setup[fieldKey].items[card]; i++) {
                G.fields[fieldKey].items.push({
                    id: `card-${counter++}`,
                    card: card
                });
            }
        }
    }*/
    return G;
}

const Game = {
    name: gameRule.name,

    setup: reset,

    moves: {
        updateField(G, ctx, field, items) {
            G.fields[field].items = items;
        },
        resetGame(G, ctx) {
            Object.assign(G, reset());
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
