import React, { Component } from 'react';
import update from 'react/lib/update';
import Card from './Card';
import BoxTarget from './BoxTarget';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import _ from 'lodash'

const style = {
  width: 600
};

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.moveCardToBox = this.moveCardToBox.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.state = {
      cards: [{
        id: 1,
        text: 'Write a cool JS library',
        selected: false
      }, {
        id: 2,
        text: 'Make it generic enough',
        selected: false
      }, {
        id: 3,
        text: 'Write README',
        selected: false
      }, {
        id: 4,
        text: 'Create some examples',
        selected: false
      }, {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it',
        selected: false
      }, {
        id: 6,
        text: '???',
        selected: false
      }, {
        id: 7,
        text: 'PROFIT',
        selected: false
      }],
      cardsInBox: [],
      selectedCards: []
    };
  }

  moveCard(id, afterId) {
    const { cards } = this.state;

    const card = cards.filter(c => c.id === id)[0];
    const afterCard = cards.filter(c => c.id === afterId)[0];
    const cardIndex = cards.indexOf(card);
    const afterIndex = cards.indexOf(afterCard);

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [cardIndex, 1],
          [afterIndex, 0, card]
        ]
      }
    }));
  }

  moveCardToBox(id) {
    this.setState(update(this.state, {
      cardsInBox: { $push: [id] }
    }));
  }

  selectCard(e, id) {
      var combineSelections = function (currentIndex, lastIndex, shiftKey, ctrlKey) {
              if (shiftKey) {
                  return lastIndex <= currentIndex ? _.range(lastIndex, currentIndex+1): _.range(currentIndex, lastIndex+1);
              } else {
                  return [currentIndex];
              }
          },
          lastSelected = this.state.lastSelected,
          indexOfCurrent = _.findIndex(this.state.cards, (card => card.id === id)),
          selectedIndexes = combineSelections(indexOfCurrent, this.state.anchorIndex, e.shiftKey, e.ctrlKey),
          updateCard = function (card, index) {
              if (selectedIndexes.indexOf(index) !== -1) {
                  card.selected = true;
              } else {
                  card.selected = false;
              }
              return card;
          },
          updatedCards = this.state.cards.map(updateCard);
      console.log(e);
      console.log(e.shiftKey);

    this.setState({
        cards: updatedCards,
        anchorIndex: e.shiftKey? this.state.anchorIndex : indexOfCurrent
    });
  }

  render() {
    const { cards } = this.state;
    const boxCards = cards.filter(card => this.state.cardsInBox.indexOf(card.id) !== -1).map(card => {
      return (card.text)
    })

    return (
      <div style={style}>
        <div style={{ float: 'left' }}>
          {cards.filter(card => this.state.cardsInBox.indexOf(card.id) === -1).map(card => {
            return (
              <Card key={card.id}
                    id={card.id}
                    text={card.text}
                    moveCard={this.moveCard}
                    selectCard={this.selectCard}
                    selected={card.selected} />
            );
          })}
        </div>
        <div style={{ float: 'right'}}>
          <BoxTarget  items={boxCards}
                      moveCardToBox={this.moveCardToBox}/>
        </div>
      </div>
    );
  }
}
