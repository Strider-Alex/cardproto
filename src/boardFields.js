import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import cardInfo from './settings/card.json';
import './boardField.css'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, bgColor, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid/2}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : bgColor,//'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = (isDraggingOver, key) => {
    console.log(key)
    let style = {
        background: isDraggingOver ? 'lightblue' : 'lightgrey',
    }
    return style
}
// const getDroppableId = (index, name) => `droppable-${index}`;
const getDroppableId = (index, name) => name;

class BoardFields extends Component {
    static propTypes = {
        moves: PropTypes.any.isRequired,
        G: PropTypes.any.isRequired,
        playerID: PropTypes.string.isRequired,
    };

    state = {
        selected: null
    };

    getList = id => this.props.G.fields[id].items;

    shuffleItems = (e, fieldKey) => {
        this.props.moves.shuffleItems(fieldKey)
    };

    accessable = (fieldKey) => {
        const field = this.props.G.fields[fieldKey];
        return field.revealed || !(field.access === 'none' ||
            (field.owner === 'player' && field.access === 'private' && !fieldKey.includes(this.props.playerID)));
    };

    revealable = (fieldKey) => {
        const field = this.props.G.fields[fieldKey];
        return (field.revealable && field.owner === 'player' && field.access === 'private'
            && fieldKey.includes(this.props.playerID));
    };

    selected = id => id === this.state.selected;

    onClick = (e, id) => {
        if (id === this.state.selected) {
            this.setState({ selected: null });
        }
        else {
            this.setState({ selected: id });
        }
    }

    onCounterChange = (e, fieldKey) => {
        this.props.moves.updateCounter(fieldKey, e.target.value);
    }

    onRevealField = (e, fieldKey) => {
        this.props.moves.revealField(fieldKey, e.target.checked);
    }

    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );
            this.props.moves.updateField(source.droppableId, items)
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );
            this.props.moves.updateField(source.droppableId, result[source.droppableId])
            this.props.moves.updateField(destination.droppableId, result[destination.droppableId])
        }
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {Object.keys(this.props.G.fields).map((fieldKey, fieldIndex) => (
                    <div key={fieldIndex}>
                        <Droppable droppableId={getDroppableId(fieldIndex, fieldKey)}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    className={('css' in this.props.G.fields[fieldKey]) ?
                                        this.props.G.fields[fieldKey]['css'] : "field-3"}
                                    style={getListStyle(snapshot.isDraggingOver, fieldKey)}>
                                    <p>{fieldKey}</p>
                                    {('text' in this.props.G.fields[fieldKey]) ?
                                        this.props.G.fields[fieldKey]['text'] :
                                        null}
                                    {('counter' in this.props.G.fields[fieldKey]) ?
                                        <input
                                            type="text"
                                            class="field_input_textbox"
                                            onChange={(e) => this.onCounterChange(e, fieldKey)}
                                            value={this.props.G.fields[fieldKey].counter}
                                        /> :
                                        null}
                                    <button onClick={(e) => this.shuffleItems(e, fieldKey)}>Shuffle!</button>
                                    {(this.revealable(fieldKey)) ?
                                        <>
                                        <label id="text"> Reveal Cards</label>
                                        <input type="checkbox" onClick={(e) => this.onRevealField(e, fieldKey)} checked={(this.props.G.fields[fieldKey].revealed)} />
                                        </>
                                        : null}
                                    {this.props.G.fields[fieldKey].items.map((item, index) => (!item)? "" : (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        ('card-color' in this.props.G.fields[fieldKey]) ? this.props.G.fields[fieldKey]['card-color'] : 'grey',
                                                        provided.draggableProps.style
                                                    )}>
                                                    <p onClick={(e) => this.onClick(e, item.id)}>{(this.accessable(fieldKey)) ? cardInfo[item.card].name : '???'}</p>
                                                    {(this.accessable(fieldKey) && this.selected(item.id)) ? <span>{cardInfo[item.card].text}</span> : null}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </DragDropContext>
        );
    }

}

export default BoardFields;
