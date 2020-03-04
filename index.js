class MemoryGame {
  constructor(firstCard, secondCard) {
    this.firstCard = firstCard;
    this.secondCard = secondCard;
    this.flippedCard = false;
    this.lockBoard = false;
    this.countMatches = 0;
  }

  flipCard(card) {
    if (this.lockBoard) return;
    if (this.firstCard !== undefined && this.secondCard !== undefined) return;
    card.classList.add('flip');

    return !this.flippedCard
      ? this.flipFirstCard(card)
      : this.flipSecondCard(card);
  }

  flipFirstCard(card) {
    this.flippedCard = true;
    this.firstCard = card;
  }

  flipSecondCard(card) {
    this.secondCard = card;
    this.flippedCard = false;
    return this.checkForMatch();
  }

  checkForMatch() {
    this.secondCard.dataset.image === this.firstCard.dataset.image
      ? this.disableCards()
      : this.unflipCards();
  }

  unflipCards() {
    this.lockBoard = true;
    setTimeout(() => {
      this.firstCard.classList.remove('flip');
      this.secondCard.classList.remove('flip');
      this.lockBoard = false;
      this.resetBoard();
    }, 1500);
  }

  unflipAllCards(cards) {
    this.resetBoard();
    cards.forEach((card) => card.classList.remove('flip'));
  }

  disableCards() {
    this.countMatches = this.countMatches + 1;
    // this.firstCard.removeEventListener('click', this.flipCard, false);
    // this.secondCard.removeEventListener('click', this.flipCard, false);
    this.resetBoard();
  }

  resetBoard() {
    console.log('match count', this.countMatches);
    if (this.countMatches === 6) return this.winner();
    removeListeners();
    this.flippedCard = false;
    this.lockBoard = false;
    this.firstCard = undefined;
    this.secondCard = undefined;
  }

  shuffle(cards) {
    document.getElementById('winner').innerText = '';
    this.countMatches = 0;
    this.unflipAllCards(cards);
    const areas = [
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
    ];
    let randomPos;
    cards.forEach((card) => {
      randomPos = areas[Math.floor(Math.random() * areas.length)];
      card.style.gridArea = randomPos;
      for (let i = 0; i < areas.length; i++) {
        if (areas[i] === randomPos) {
          areas.splice(i, 1);
        }
      }
    });
  }

  winner() {
    document.getElementById('winner').innerText = 'YOU WON!';
  }
}

const memory = new MemoryGame();
const cards = document.querySelectorAll('.card');
document
  .getElementById('shuffle')
  .addEventListener('click', () => memory.shuffle(cards));

window.onload = memory.shuffle(cards);
function flipCard(card) {
  return memory.flipCard(card);
}
function getCards() {
  return document.querySelectorAll('.card');
}
function removeListeners() {
  return getCards().forEach((card) => {
    console.log(card.className);
    console.log('I remove event');
    if (card.className.includes('flip')) {
      return card.removeEventListener('click', () => flipCard(card));
    }
  });
}
window.onload = () => {
  return cards.forEach((card) => {
    console.log('I add event');
    card.addEventListener('click', () => flipCard(card));
  });
};
