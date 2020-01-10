import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

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
    debugger;
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

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});

// const getDroppableId = (index, name) => `droppable-${index}`;
const getDroppableId = (index, name) => name;

const parseFields = fields => {
    let result = {};
    fields.forEach((item, index) => {
        result[getDroppableId(index, item.name)] = item;
        result[getDroppableId(index, item.name)].items = getItems(5, 5 * index);
    })
    console.log(result);
    return result;
};

class BoardFields extends Component {
    static propTypes = {
        fields: PropTypes.any.isRequired,
    };

    state = {
        fields: parseFields(this.props.fields)
    };

    getList = id => this.state.fields[id].items;

    getUpdatedState = (fieldKey, items, baseState) => {
        if (!baseState) {
            baseState = this.state;
        }
        return update(baseState, {
            fields: {
                [fieldKey]: {
                    items: { $set: items }
                }
            }
        });
    }

    shuffleItem = (e, fieldKey) => {
        let items = [...this.state.fields[fieldKey].items];
        // start to shuffle
        let currentIndex = items.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = items[currentIndex];
            items[currentIndex] = items[randomIndex];
            items[randomIndex] = temporaryValue;
        }
        this.setState(this.getUpdatedState(fieldKey, items));
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
            this.setState(this.getUpdatedState(source.droppableId, items));
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );
            const state = this.getUpdatedState(source.droppableId, result[source.droppableId]);
            this.setState(this.getUpdatedState(destination.droppableId, result[destination.droppableId], state));
        }
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {Object.keys(this.state.fields).map((fieldKey, fieldIndex) => (
                    <div key={fieldIndex}>
                        <p>{this.state.fields[fieldKey].name}</p>
                        <button onClick={(e)=>this.shuffleItem(e, fieldKey)}>Shuffle!</button>
                        <Droppable droppableId={getDroppableId(fieldIndex, fieldKey)}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}>
                                    {this.state.fields[fieldKey].items.map((item, index) => (
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
                                                        provided.draggableProps.style
                                                    )}>
                                                    {(this.state.fields[fieldKey].access == 'none') ? '???' : item.content}
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
