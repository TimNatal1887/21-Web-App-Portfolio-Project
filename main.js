const dealerHand = document.querySelector("#dealers-count");
const playerHand = document.querySelector("#players-count");
const wagerForm = document.querySelector(".wager")
const ruleText = document.querySelector(".default")
const restartButton = document.querySelector(".reset")
const drawButton = document.querySelector(".draw")
const holdButton = document.querySelector(".hold")
const winMessage = document.querySelector(".win-message")
const errorMessage = document.querySelector(".error")
const cardWrapper = document.querySelector(".starting-cards")

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

function handleHoldButton(event){
    event.preventDefault();
    let foundWinner = "";
    let dealersCount = parseInt(dealerHand.textContent)
    let playersCount = parseInt(playerHand.textContent)
    drawButton.style.display = "none";
    holdButton.style.display = "none";
    const playerTurnOver = true;

    if(dealersCount >= 17){
        foundWinner = checkWinner(dealersCount,playersCount,playerTurnOver,true)
    }else{
        foundWinner = checkWinner(dealersCount,playersCount,playerTurnOver,false)
    }

    if(foundWinner){
        isWinnerFound(foundWinner)
    }else{
        const intervalId = setInterval(() => {
            dealersCount = dealerDraws(dealersCount, playersCount, playerTurnOver, intervalId);
        }, 2000);
    }
}


function handleRestartButton(event){
    event.preventDefault();
    fetch("https://deckofcardsapi.com/api/deck/fmlxy9qw29b8/shuffle/")
    resetPage();
}

function dealerDraws(count1, count2, playerTurnOver, intervalId) {
    fetch("https://deckofcardsapi.com/api/deck/fmlxy9qw29b8/draw/?count=1")
        .then((response) => response.json())
        .then((data) => {
            displayCard(dealerHand, "dealer", data.cards[0]);
            count1 = cardCounter(dealerHand, document.querySelectorAll(".dealer"));
            document.querySelector("#dealers-count").textContent = count1;
            if (count1 < 21 && count1 < count2 && count1 < 17) {
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

function handleDrawButton(event){
    event.preventDefault();
    let dealersCount = parseInt(dealerHand.textContent)
    let playersCount = parseInt(playerHand.textContent)
    let foundWinner = "";
    fetch("https://deckofcardsapi.com/api/deck/fmlxy9qw29b8/draw/?count=1")
    .then((response) => response.json())
    .then((data) => {
        displayCard(playerHand,"player",data.cards[0]);
        playersCount = cardCounter("player",document.querySelectorAll(".player"));
        foundWinner = checkWinner(dealersCount, playersCount, false, false);
        isWinnerFound(foundWinner);
    })
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
    } else if ((count2 <= count1 && count1 <= 21 && playerTurnOver) || (count2 > 21 && count1 <= 21)) {
        winMessage.classList.add("dealer-won");
        winMessage.textContent = "Dealer Wins!";
        winner = 'Dealer';
        points *=2
        playerPointsLost += points
        pointsLost.textContent = `${playerPointsLost}`
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
    const cardList = document.querySelectorAll(".card")
    const dealerHand = document.querySelector("#dealers-count");
    const playerHand = document.querySelector("#players-count");
    const wagerAmount = document.querySelector("#wager-amount");
    if(winMessage.classList.contains("dealer-won")){
        winMessage.classList.remove("dealer-won")
    }else{
        winMessage.classList.remove("player-won")
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