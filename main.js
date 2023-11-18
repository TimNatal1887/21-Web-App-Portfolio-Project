import { startGame, displayCard, startingCards, removeStartingCards, playerHand, dealerHand, cardWrapper } from "./scripts/cardController.js"
import { handleRestartButton, handleHoldButton, restartButton, drawButton, holdButton, handleDrawButton,intervalId } from "./scripts/buttonControllers.js"
const wagerForm = document.querySelector(".wager")
const ruleText = document.querySelector(".default")
const winMessage = document.querySelector(".win-message")
const errorMessage = document.querySelector(".error")

document.addEventListener("DOMContentLoaded",()=>{
    fetch("https://deckofcardsapi.com/api/deck/fmlxy9qw29b8/shuffle/")
    .catch((error)=> console.log(error))
    
    startingCards()
    wagerForm.addEventListener("submit",(event)=>{
        event.preventDefault()
        if(!wagerForm.checkValidity()){
            errorMessage.style.display = "block"
        }else{
            errorMessage.style.display = "none"
            fetch("https://deckofcardsapi.com/api/deck/fmlxy9qw29b8/draw/?count=2")
            .then((response) => response.json())
            .then((data)=> {
                data.cards.forEach(card => displayCard(playerHand,"player",card))
                startGame()
            })
        
            fetch("https://deckofcardsapi.com/api/deck/fmlxy9qw29b8/draw/?count=2")
            .then((response) => response.json())
            .then((data)=> {
                data.cards.forEach(card => displayCard(dealerHand,"dealer",card))
            })
        }
        holdButton.addEventListener("submit", handleHoldButton);
        restartButton.addEventListener("submit", handleRestartButton) 
        removeStartingCards()
    })
})

function checkWinner(count1, count2, playerTurnOver, dealerTurnOver){
    const pointsWon = document.querySelector("#points-won");
    const pointsLost = document.querySelector("#points-lost");
    let points = parseInt(document.querySelector("#wager-amount").textContent)
    let playerWonPoints = parseInt(pointsWon.textContent);
    let playerPointsLost = parseInt(pointsLost.textContent);
    let winner = "";
    if ((count2 > count1 && count2 <= 21 && dealerTurnOver) || (count2 <= 21 && count1 > 21)) {
        winMessage.classList.add("player-won");
        winMessage.textContent = "Player Wins!";
        winner = 'Player';
        points *=2
        playerWonPoints += points
        pointsWon.textContent = `${playerWonPoints}`
        isWinnerFound(winner)
    } else if ((count2 < count1 && count1 <= 21 && playerTurnOver) || (count2 > 21 && count1 <= 21)) {
        winMessage.classList.add("dealer-won");
        winMessage.textContent = "Dealer Wins!";
        winner = 'Dealer';
        points *=2
        playerPointsLost += points
        pointsLost.textContent = `${playerPointsLost}`
        isWinnerFound(winner)
    }else if(count2 === count1 && playerTurnOver && dealerTurnOver){
        winMessage.classList.add("tie-game")
        winMessage.textContent = "Draw"
        winner = "Draw"
        isWinnerFound(winner)
    }
    return winner;
}

function isWinnerFound(foundWinner){
    if(foundWinner){
        ruleText.style.display = "none"
        drawButton.style.display = "none"
        holdButton.style.display = "none"
        winMessage.style.display = "inline"
    }
}

function resetPage(){
    clearInterval(intervalId)
    const cardList = document.querySelectorAll(".card")
    const dealerHand = document.querySelector("#dealers-count");
    const playerHand = document.querySelector("#players-count");
    const wagerAmount = document.querySelector("#wager-amount");
    if(winMessage.classList.contains("dealer-won")){
        winMessage.classList.remove("dealer-won")
    }else if(winMessage.classList.contains("player-won")){
        winMessage.classList.remove("player-won")
    }else{
        winMessage.classList.remove("tie-game")
    }
    ruleText.style.display = "none"
    drawButton.style.display = "none"
    holdButton.style.display = "none"
    winMessage.style.display = "none"
    wagerForm.style.display = "inline"
    cardWrapper.style.display = "flex"  

    cardList.forEach(card=> card.remove())
    dealerHand.textContent = ""
    playerHand.textContent = ""
    wagerAmount.textContent = ""
    restartButton.style.display = "none"
    wagerForm.reset()
    startingCards()
    holdButton.removeEventListener("submit",handleHoldButton)
    drawButton.removeEventListener("submit",handleDrawButton)
}

export {
    wagerForm,
    ruleText,
    isWinnerFound,
    checkWinner,
    resetPage
}