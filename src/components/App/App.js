import React, { Component } from "react";
import shuffle from "lodash.shuffle";
import HallOfFame, { FAKE_HOF } from "../hallOfFame/hallOfFame";
import HighScoreInput from "../HighScoreInput/HighScoreInput";

import "./App.css";

import Card from "../Card/Card";
import GuessCount from "../GuessCount/GuessCount";

const SIDE = 6;
const SYMBOLS = "😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿";
const VISUAL_PAUSE_MSECS = 750;

class App extends Component {
   state = {
      cards: this.generateCards(),
      currentPair: [],
      guesses: 0,
      matchedCardIndeces: [],
   };

   generateCards() {
      const result = [];
      const size = SIDE * SIDE;
      const candidates = shuffle(SYMBOLS);
      console.log(candidates);
      while (result.length < size) {
         const card = candidates.pop();
         result.push(card, card);
      }
      return shuffle(result);
   }

   getFeedBackForCard = (index) => {
      const { currentPair, matchedCardIndeces } = this.state;
      const indexMatched = matchedCardIndeces.includes(index);

      if (currentPair.lenth < 2) {
         return indexMatched || index === currentPair[0] ? "visible" : "hidden";
      }

      if (currentPair.includes(index)) {
         return indexMatched ? "justMatched" : "justMisMatched";
      }

      return indexMatched ? "visible" : "hidden";
   };

   handleCardClick = (index) => {
      const { currentPair } = this.state;
      if (currentPair.length === 2) {
         return;
      }

      if (currentPair.length === 0) {
         this.setState({ currentPair: [index] });
         return;
      }

      this.handleNewPairClosedBy(index);
   };

   handleNewPairClosedBy(index) {
      const { cards, currentPair, guesses, matchedCardIndeces } = this.state;

      const newPair = [currentPair[0], index];
      const newGuesses = guesses + 1;
      const matched = cards[newPair[0]] === cards[newPair[1]];
      this.setState({ currentPair: newPair, guesses: newGuesses });
      if (matched) {
         this.setState({
            matchedCardIndeces: [...matchedCardIndeces, ...newPair],
         });
      }
      setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS);
   }

   render() {
      const { cards, guesses, matchedCardIndeces } = this.state;
      const won = matchedCardIndeces.length === cards.length;

      return (
         <div className="memory">
            <GuessCount guesses={guesses} />
            {cards.map((card, index) => (
               <Card
                  card={card}
                  feedback={this.getFeedBackForCard(index)}
                  cardClick={this.handleCardClick}
                  key={index}
                  index={index}
               />
            ))}

            {won && <HallOfFame entries={FAKE_HOF} />}
         </div>
      );
   }
}

export default App;
