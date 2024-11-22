import './style.css'
import Swal from 'sweetalert2'
import popularEmojis from './popularEmojis'
import '@sweetalert2/themes/dark/dark.scss';


const gameField = document.getElementById('gameField')
const pairsClicked = document.getElementById('pairsClicked')
const pairsGuessed = document.getElementById('pairsGuessed')
const timer = document.getElementById('timer')
const logo = document.getElementById('h1Top')

let pairsGuessedCounter = 0;
let pairsClickedCounter = 0;


let gameEmojis = popularEmojis.sort(() => 0.5 - Math.random()).slice(0, 12)

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
  pairsGuessedCounter = 0;
  pairsClickedCounter = 0;
  isBlocked = true;
  clearInterval(intervalId);
  intervalId = undefined;
  Swal.fire({
    title: "Congratulations!",
    html: "<b>You won the Game!<b>",
    icon: "success"
  }).then(() => {
    isBlocked = false;
    firstCard = -1;
    secondCard = -1;
    gameEmojis = popularEmojis.sort(() => 0.5 - Math.random()).slice(0, 12)

    // window.location.reload()
    memoryArr = memoryArr.sort(() => 0.5 - Math.random())
    for (let i = 0; i < gameField!.children.length; i++) {
      gameField!.children[i].classList.remove('reveal')
      gameField!.children[i].innerHTML = `<div class="front"></div>
  <div class="back">
  <p>${gameEmojis[memoryArr[i]]}</p>
  </div>`;
    }
    timerCount = 0;
    timer!.textContent = "";
    pairsClicked!.textContent = "Pairs Clicked: 0";
    pairsGuessed!.textContent = "Pairs Guessed: 0";
  })
}

for (let i = 0; i < 6 * 4; i++) {
  const card = document.createElement('div')
  card.className = "card"
  card.innerHTML = `<div class="front"></div>
  <div class="back">
  <p>${gameEmojis[memoryArr[i]]}</p>
  </div>`;

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
          if (pairsGuessedCounter == 12) {
            reset()
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


let intervalId2: number | undefined = undefined;
let posArr = 0;
logo?.addEventListener('dblclick', () => {

  if (!intervalId2) {
    let map = new Map<number, number[]>();
    for (let i = 0; i < memoryArr.length; i++) {
      if (map.has(memoryArr[i])) {
        const a1 = map.get(memoryArr[i]);
        a1?.push(i)
        map.set(memoryArr[i], a1 || [])
      } else {
        map.set(memoryArr[i], [i])
      }
    }


    intervalId2 = setInterval(() => {
      const cards = map.get(posArr)
      if (!gameField?.children[cards![0]].classList.contains('reveal')) {
        gameField?.children[cards![0]].classList.add('reveal')
        return
      }

      gameField?.children[cards![1]].classList.add('reveal')
      posArr++;
      pairsGuessedCounter++
      pairsClickedCounter++;

      pairsClicked!.textContent = "Pairs Clicked: " + pairsClickedCounter
      pairsGuessed!.textContent = "Pairs Guessed: " + pairsGuessedCounter
      if (posArr >= 12) {
        console.log({ posArr, pairsClickedCounter })
        clearInterval(intervalId2);
        intervalId2 = undefined;
        posArr = 0;
        reset();
      }
    }, 750);
  }
})