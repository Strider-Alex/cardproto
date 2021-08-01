/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
import gameRule from './settings/game.json';
import setup from './settings/setup.json';
import { ActivePlayers } from 'boardgame.io/core';
import { shuffle } from './utils';

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
        fields: {},
        gameTurn: 1,
        dice0Value: "2-12",
        dice1Value: "2-12"
    };
    const fields = gameRule.fields;
    let counter = 0;
    for (let fieldKey in fields)
    {
        const n = numOfInstances(fields[fieldKey]);
        for (let idx=0; idx<n; idx++) {
            const k = newKey(fieldKey, idx, n);
            G.fields[k] = {...fields[fieldKey]}; // deep copy is needed here
            G.fields[k].items = [];
            G.fields[k].revealed = false;
            // setup for each instance
            if (k in setup) {
                for(let card in setup[k].items) {
                    for (let i = 0; i<setup[k].items[card]; i++) {
                        G.fields[k].items.push({
                            id: `card-${counter++}`,
                            card: card
                        });
                    }
                }
                if (setup[k].shuffle) {
                    shuffle(G.fields[k].items);
                }
            }
        }
    }
    return G;
}

const Game = {
    name: gameRule.name,

    setup: reset,

    moves: {
        updateField(G, ctx, field, items) {
            G.fields[field].items = items;
        },
        shuffleItems(G, ctx, fieldKey) {
            shuffle(G.fields[fieldKey].items);
        },
        updateCounter(G, ctx, fieldKey, s) {
            G.fields[fieldKey].counter = s;
        },
        revealField(G, ctx, fieldKey, isChecked) {
            G.fields[fieldKey].revealed = isChecked;
        },
        resetGame(G, ctx) {
            Object.assign(G, reset());
        },
        endTurn(G, ctx) {
            G.gameTurn = G.gameTurn + 1;
        },
        throwDice0(G, ctx) {
            G.dice0Value = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;//Math.floor(Math.random() * 12) + 1;
        },
        throwDice1(G, ctx) {
            G.dice1Value = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;//Math.floor(Math.random() * 12) + 1;
        }
    },

    turn: {
        activePlayers: ActivePlayers.ALL
    },

    endIf: (G, ctx) => {
        if (IsVictory(G.cells)) {
            return { winner: ctx.currentPlayer };
        }
    }
};

export default Game;
