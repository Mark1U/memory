import './style.css'

const gameField = document.getElementById('gameField')
const pairsClicked = document.getElementById('pairsClicked')
const pairsGuessed = document.getElementById('pairsGuessed')

let pairsGuessedCounter = 0;
let pairsClickedCounter = 0;

const popularEmojis: string[] = [
  "😀", // Grinning Face
  "😂", // Face with Tears of Joy
  "❤️", // Red Heart
  "🔥", // Fire
  "😊", // Smiling Face with Smiling Eyes
  "👍", // Thumbs Up
  "🥺", // Pleading Face
  "🎉", // Party Popper
  "✨", // Sparkles
  "🙏", // Folded Hands
  "💀", // Skull
  "🍕"  // Pizza
];


let memoryArr: number[] = []
for (let i = 0; i < 6 * 2; i++) {
  memoryArr.push(i)
  memoryArr.push(i)
}

memoryArr = memoryArr.sort(() => 0.5 - Math.random())
let firstCard = -1;
let secondCard = -1;

let isBlocked = false;

for (let i = 0; i < 6 * 4; i++) {
  const card = document.createElement('div')
  card.className = "card"
  card.innerHTML = `<p>${popularEmojis[memoryArr[i]]}</p>`;

  card.addEventListener('click', () => {
    if (firstCard != i && !isBlocked && !card.classList.contains('reveal')) {
      card.classList.add('reveal')
      if (firstCard == -1) {
        firstCard = i;
      } else {
        secondCard = i;
        pairsClickedCounter++
        pairsClicked!.textContent = "Pairs Clicked: " + pairsClickedCounter
        if (memoryArr[firstCard] == memoryArr[i]) {
          // Match
          pairsGuessedCounter++
          pairsGuessed!.textContent = "Pairs Guessed: " + pairsGuessedCounter
          firstCard = -1;
          secondCard = -1;
        } else {
          // kein Match
          isBlocked = true;
          setTimeout(() => {
            gameField?.children[firstCard].classList.remove('reveal')
            gameField?.children[secondCard].classList.remove('reveal')
            firstCard = -1;
            secondCard = -1;
            isBlocked = false;
          }, 1000);
        }
      }
    }
  })
  gameField?.appendChild(card)
}