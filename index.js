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
    card.style.pointerEvents = 'none';
  }

  flipSecondCard(card) {
    this.secondCard = card;
    this.flippedCard = false;
    card.style.pointerEvents = 'none';
    return this.checkForMatch();
  }

  checkForMatch() {
    this.secondCard.dataset.image === this.firstCard.dataset.image
      ? this.disableCards()
      : this.unFlipCards();
  }

  unFlipCards() {
    this.lockBoard = true;
    setTimeout(() => {
      this.firstCard.classList.remove('flip');
      this.secondCard.classList.remove('flip');
      this.firstCard.style.pointerEvents = 'auto';
      this.secondCard.style.pointerEvents = 'auto';
      this.lockBoard = false;
      this.resetBoard();
    }, 1500);
  }

  unFlipAllCards(cards) {
    this.resetBoard();
    cards.forEach((card) => card.classList.remove('flip'));
  }

  disableCards() {
    this.countMatches = this.countMatches + 1;
    memory.getCards().forEach((card) => {
      if (card.className.includes('flip')) {
        card.style.pointerEvents = 'none';
      }
    });
    this.resetBoard();
  }

  resetBoard() {
    if (this.countMatches === 6) return this.winner();
    this.flippedCard = false;
    this.lockBoard = false;
    this.firstCard = undefined;
    this.secondCard = undefined;
  }

  shuffle(cards) {
    let randomPosition;
    if (this.countMatches > 0 && this.firstCard !== undefined) {
      this.resetWinner();
    }
    this.unFlipAllCards(cards);
    const areas = this.gameBoardPositions();

    cards.forEach((card) => {
      randomPosition = areas[Math.floor(Math.random() * areas.length)];
      card.style.gridArea = randomPosition;

      this.removedUsedPosition(areas, randomPosition);
    });
  }

  gameBoardPositions() {
    return [
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
  }

  removedUsedPosition(areas, position) {
    for (let i = 0; i < areas.length; i++) {
      if (areas[i] === position) {
        areas.splice(i, 1);
      }
    }
  }

  winner() {
    return this.createAndDisplayWinnerContainer();
  }

  resetWinner() {
    this.countMatches = 0;
    const body = document.querySelector('body');
    const winner = document.getElementById('winner');
    body.removeChild(winner);
  }

  getCards() {
    return document.querySelectorAll('.card');
  }

  getWinnerContainer() {
    return document.getElementById('winner');
  }

  createAndDisplayWinnerContainer() {
    const main = document.getElementById('start');
    const winnerContainer = document.createElement('section');
    const winnerContent = document.createElement('article');
    winnerContent.textContent = 'YOU WON!';
    winnerContainer.appendChild(winnerContent);
    winnerContainer.setAttribute('id', 'winner');
    winnerContent.setAttribute('class', 'you-won');
    document.body.insertBefore(winnerContainer, main);
  }

  getShuffleButton() {
    return document.getElementById('shuffle');
  }
}

const memory = new MemoryGame();

memory
  .getShuffleButton()
  .addEventListener('click', () => memory.shuffle(memory.getCards()));

window.onload = () => {
  memory.shuffle(memory.getCards());
  return memory.getCards().forEach((card) => {
    card.addEventListener('click', () => memory.flipCard(card), false);
  });
};
