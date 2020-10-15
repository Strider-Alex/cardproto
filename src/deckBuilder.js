import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';
import cardInfo from './settings/card.json';
import setup from './settings/setup.json';
import update from 'immutability-helper';

class DeckBuilder extends Component {

    state = {
        setup: JSON.parse(JSON.stringify(setup))
    };

    saveDeck() {
        
    }

    updateState(fieldKey, cardKey, value) {
        const newSetup = update(this.state.setup, {
            [fieldKey]: {items: {[cardKey]: {$set: value}}}
          });
        this.setState({
            setup:newSetup
        });
    }

    render() {
        return (
            Object.keys(setup).map((fieldKey, idx) => {
                return (
                    <div key={idx}>
                        <h4>{fieldKey}</h4>
                        <button>save</button>
                        <div>
                            {
                                Object.keys(cardInfo).map((cardKey, idx) => {
                                    return (
                                        <div key={idx}>
                                            <span>{cardKey}: </span>
                                            <NumericInput onChange={(value)=>this.updateState(fieldKey, cardKey, value)} min={0} max={5} value={this.state.setup[fieldKey].items[cardKey]||0} />
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
