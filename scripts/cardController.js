import { drawButton, holdButton, restartButton, handleDrawButton } from "./buttonControllers.js";
import { wagerForm, ruleText, isWinnerFound, checkWinner } from "../main.js"

const cardWrapper = document.querySelector(".starting-cards")
const dealerHand = document.querySelector("#dealers-count");
const playerHand = document.querySelector("#players-count");

function dealerDraws(count1, count2, playerTurnOver, intervalId) {
    let foundWinner = ""
    fetch("https://deckofcardsapi.com/api/deck/fmlxy9qw29b8/draw/?count=1")
        .then((response) => response.json())
        .then((data) => {
            displayCard(dealerHand, "dealer", data.cards[0]);
            count1 = cardCounter(dealerHand, document.querySelectorAll(".dealer"));
            document.querySelector("#dealers-count").textContent = count1;
            if (count1 < 21 && count1 <= count2 && count1 < 17) {
                return count1
            } else {
                clearInterval(intervalId);
                foundWinner = checkWinner(count1,count2, playerTurnOver, true);
                isWinnerFound(foundWinner);
            }
    });
}

function startGame(){
    const wagerAmount = document.querySelector("#wager-amount")
    const points = document.querySelector("#points").value
    drawButton.style.display = "inline"
    holdButton.style.display = "inline"
    wagerForm.style.display ="none"
    restartButton.style.display = "inline"
    ruleText.style.display = "inline"
    wagerAmount.textContent = `${points}`   
    drawButton.addEventListener("click",handleDrawButton); 
    cardWrapper.style.display = "none"  
}


function displayCard(hand,player,card){
    const cardList = document.querySelector(`.${player}-hand`)
    const newCard = document.createElement("li");
    newCard.classList.add("card");
    newCard.classList.add(player)
    newCard.id = `${card.value}`
    newCard.innerHTML = `<img src="${card.image}" alt="">`
    cardList.append(newCard)
    const allCards = document.querySelectorAll(`.${player}`)
    cardCounter(hand,allCards)  
}

function cardCounter(hand,cards){
    let aceCount = 0
    let cardCount = 0
    cards.forEach(card=> {
        const cardValue = card.id
        if(cardValue === "KING" || cardValue === "QUEEN" || cardValue === "JACK"){
            cardCount += 10
        }else if(cardValue === "ACE"){
            aceCount++
            cardCount += 11  
        }else{
            cardCount += +cardValue
        }
    })
    while(cardCount > 21 && aceCount > 0){
        cardCount -= 10
        aceCount--  
    }
    hand.textContent = `${cardCount}`
    return cardCount
}


function startingCards(){
    fetch("https://deckofcardsapi.com/api/deck/fmlxy9qw29b8/draw/?count=2")
    .then((response)=> response.json())
    .then((data)=>{
        data.cards.forEach((card,index)=>{
            const newCard = document.createElement("div");
            newCard.classList.add("starting-card");
            newCard.classList.add(`card-number-${index}`)
            newCard.innerHTML =  `<img src="${card.image}" alt="">`
            if(index === 1){
                newCard.style.gridColumn = 1
            }else{
                newCard.style.gridColumn = 5
            }
            newCard.style.gridRow = 4
            document.querySelector(".starting-cards").append(newCard)
        })
    })
}

function removeStartingCards(){
    const startingCards = document.querySelectorAll(".starting-card")
    startingCards.forEach(card=> card.remove())
}

export {
    dealerDraws,
    startGame,
    displayCard,
    cardCounter,
    startingCards,
    removeStartingCards,
    playerHand,
    dealerHand,
    cardWrapper
}