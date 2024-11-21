import './style.css'
import Swal from 'sweetalert2'

const gameField = document.getElementById('gameField')
const pairsClicked = document.getElementById('pairsClicked')
const pairsGuessed = document.getElementById('pairsGuessed')
const timer = document.getElementById('timer')

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
let timerCount = 0;
let intervalId: number | undefined;


function reset() {
  memoryArr = memoryArr.sort(() => 0.5 - Math.random())
  for (let i = 0; i < gameField!.children.length; i++) {
    gameField!.children[i].classList.remove('reveal')
    gameField!.children[i].innerHTML = `<p>${popularEmojis[memoryArr[i]]}</p>`;
  }
  timerCount = 0;
  timer!.textContent = "";
  pairsClicked!.textContent = "Pairs Clicked: 0";
  pairsGuessed!.textContent = "Pairs Guessed: 0";
  pairsGuessedCounter = 0;
  pairsGuessedCounter = 0;
}

for (let i = 0; i < 6 * 4; i++) {
  const card = document.createElement('div')
  card.className = "card"
  card.innerHTML = `<p>${popularEmojis[memoryArr[i]]}</p>`;

  card.addEventListener('click', () => {

    if (!intervalId) {
      intervalId = setInterval(() => {
        timerCount++
        timer!.textContent = `${(Math.floor(timerCount / 60)).toString().padStart(2, '0')}: ${(timerCount % 60).toString().padStart(2, '0')}`
      }, 1000);
    }

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
          if (pairsGuessedCounter == 2) {
            isBlocked = true;
            clearInterval(intervalId);
            intervalId = undefined;
            Swal.fire({
              title: "Gewonnen",
              text: "Glückwunsch, du hast das Spiel gewonnen!",
              icon: "success"
            }).then(() => {
              isBlocked = false;
              reset()
              // window.location.reload()
            })
          }
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