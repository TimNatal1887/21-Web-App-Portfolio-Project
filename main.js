const dealerHand = document.querySelector("#dealers-count");
const playerHand = document.querySelector("#players-count");
const wagerForm = document.querySelector(".wager")
const cardList = document.querySelector(".player-hand")
const ruleText = document.querySelector(".default")
const restartButton = document.querySelector(".reset")
const drawButton = document.querySelector(".draw")
const holdButton = document.querySelector(".hold")
const winMessage = document.querySelector(".win-message")

document.addEventListener("DOMContentLoaded",()=>{
    fetch("https://deckofcardsapi.com/api/deck/fmlxy9qw29b8/shuffle/")
    .catch((error)=> console.log(error))
})

wagerForm.addEventListener("submit",(event)=>{
    event.preventDefault()
    fetch("https://deckofcardsapi.com/api/deck/fmlxy9qw29b8/draw/?count=2")
    .then((response) => response.json())
    .then((data)=> {
        data.cards.forEach(card => displayCard(card))
        startGame()
    })
    
})

drawButton.addEventListener("click", (event) => {
    event.preventDefault();
    let dealersCount = parseInt(dealerHand.textContent)
    let playersCount = parseInt(playerHand.textContent)
    let foundWinner = "";
    fetch("https://deckofcardsapi.com/api/deck/fmlxy9qw29b8/draw/?count=1")
    .then((response) => response.json())
    .then((data) => {
        displayCard(data.cards[0]);
        playersCount = cardCounter(document.querySelectorAll(".card"));
        foundWinner = checkWinner(dealersCount, playersCount, false, false);
        isWinnerFound(foundWinner);
    });
});


holdButton.addEventListener("click", (event) => {
    event.preventDefault();
    let dealersCount = parseInt(dealerHand.textContent)
    let playersCount = parseInt(playerHand.textContent)
    let foundWinner = "";
    drawButton.style.display = "none";
    holdButton.style.display = "none";
    const playerTurnOver = true;
    foundWinner = checkWinner(dealersCount,playersCount,playerTurnOver,false)
    if(foundWinner){
        isWinnerFound(foundWinner)
    }else{
        const intervalId = setInterval(() => {
            dealersCount = dealerDraws(dealersCount, playersCount, playerTurnOver, intervalId);
        }, 2000);
    
    }
});

restartButton.addEventListener("click", (event) => {
    event.preventDefault();
    fetch("https://deckofcardsapi.com/api/deck/fmlxy9qw29b8/shuffle/")
    resetPage();
    
});

function dealerDraws(count1, count2, playerTurnOver, intervalId) {
    count1 += Math.ceil(Math.random() * 10);
    foundWinner = checkWinner(count1, count2, playerTurnOver, false);
    console.log(foundWinner)
    document.querySelector("#dealers-count").textContent = count1;

    if (count1 < 21 && count1 < count2) {
        return count1;
    } else {
        clearInterval(intervalId);
        foundWinner = checkWinner(count1, count2, playerTurnOver, true);
        isWinnerFound(foundWinner)
        console.log(foundWinner)
        return count1;
    }
}



function startGame(){
    const points = document.querySelector("#points").value
    const wagerAmount = document.querySelector(".wager-amount")
    const dealerHand = document.querySelector("#dealers-count")
    const dealerCount = Math.ceil(Math.random() * 21)
    drawButton.style.display = "inline"
    holdButton.style.display = "inline"
    wagerForm.style.display ="none"
    restartButton.style.display = "inline"
    ruleText.style.display = "inline"
    wagerAmount.textContent = `Wager Amount : ${points}`
    dealerHand.textContent = `${dealerCount}`      
}



function displayCard(card){
    const newCard = document.createElement("li");
    newCard.classList.add("card");
    newCard.id = `${card.value}`
    newCard.innerHTML = `<img src="${card.image}" alt="">`
    cardList.append(newCard)
    const allCards = document.querySelectorAll(".card")
    cardCounter(allCards)  
}

function cardCounter(cards){
    const playerHand = document.querySelector("#players-count")
    let aceCount = 0
    let playerCount = 0
    cards.forEach(card=> {
        const cardValue = card.id
        if(cardValue === "KING" || cardValue === "QUEEN" || cardValue === "JACK"){
            playerCount += 10
        }else if(cardValue === "ACE"){
            aceCount++
            playerCount += 11
            
        }else{
            playerCount += +cardValue
        }

    })
    
    while(playerCount > 21 && aceCount > 0){
        playerCount -= 10
        aceCount--
        
    }
    
    playerHand.textContent = `${playerCount}`
    return playerCount

}

function checkWinner(count1,count2,playerTurnOver,dealerTurnOver){
    let winner = ""
    if((count2 > count1 && count2 <= 21 && dealerTurnOver) || (count2 <= 21 && count1 > 21)){
        winMessage.classList.add("player-won")
        winMessage.textContent = "Player Wins!"
        winner = 'Player'
    }else if((count2 <= count1 && count1 <= 21 && playerTurnOver) || (count2 > 21 && count1 <= 21)){
        winMessage.classList.add("dealer-won")
        winMessage.textContent = "Dealer Wins!"
        winner = 'Dealer'
    }
    return winner
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
    const cardList = document.querySelectorAll(".card")
    const dealerHand = document.querySelector("#dealers-count");
    const playerHand = document.querySelector("#players-count");
    const wagerAmount = document.querySelector(".wager-amount");

    ruleText.style.display = "none"
    drawButton.style.display = "none"
    holdButton.style.display = "none"
    winMessage.style.display = "none"
    wagerForm.style.display = "inline"

    cardList.forEach(card=> card.remove())
    dealerHand.textContent = ""
    playerHand.textContent = ""
    wagerAmount.textContent = ""
    restartButton.style.display = "none"

}