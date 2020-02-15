import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';
import cardInfo from './settings/card.json';
import setup from './settings/setup.json';

class DeckBuilder extends Component {

    state = {
        //selected: null
    };

    render() {
        return (
            Object.keys(setup).map((fieldKey, idx) => {
                return (
                    <div>
                        <h4>{fieldKey}</h4>
                        <div>
                            {
                                Object.keys(cardInfo).map((cardKey, idx) => {
                                    return (
                                        <div>
                                            <span>{cardKey}: </span>
                                            <NumericInput min={0} max={5} value={0} />
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                );
            })
        );
    }
}

export default DeckBuilder;
