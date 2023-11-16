const wagerForm = document.querySelector(".wager")
const cardList = document.querySelector(".player-hand")
const ruleText = document.querySelector(".default")
const restartButton = document.querySelector(".reset")
const drawButton = document.querySelector(".draw")
const holdButton = document.querySelector(".hold")

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
    })
    startGame()
})
    
    
    
    

drawButton.addEventListener("submit",(event)=>{
    event.preventDefault()
    fetch("https://deckofcardsapi.com/api/deck/fmlxy9qw29b8/draw/?count=1")
    .then((response)=>response.json())
    .then((data)=> {
        displayCard(data.cards[0])
    })  
})

holdButton.addEventListener("submit",(event)=>{
    event.preventDefault()    
})

restartButton.addEventListener("submit",(event)=>{
    event.preventDefault()
})

function startGame(){
    const points = document.querySelector("#points").value
    const wagerAmount = document.querySelector(".wager-amount")
    // const dealerCount = randomDealer()
    
    drawButton.style.display = "inline"
    holdButton.style.display = "inline"
    wagerForm.style.display ="none"
    restartButton.style.display = "inline"
    ruleText.style.display = "inline"
    wagerAmount.textContent = `Wager Amount : ${points}`
    
    
    
}



function displayCard(card){
    const newCard = document.createElement("li");
    newCard.classList.add("card");
    newCard.id = `${card.value}`
    newCard.innerHTML = `<img src="${card.image}" alt="">`
    cardList.append(newCard)
    const allCards = document.querySelectorAll(".card")
    console.log(allCards)
    cardCounter(allCards)
    
}

function cardCounter(cards){
    const playerHand = document.querySelector(".players-hand")
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
    
    playerHand.textContent = `Player's Hand: ${playerCount}`
    return playerCount

}

// function runGame(){
//     const dealerCount = dealerCardCount()
// }

// function dealerCardCount(dealersCount,playersCount){
//     if(dealersCount < 15 || dealersCount < playersCount){
//         count += Math.ceil(Math.random() * 11)
//     }
    
// }

// function checkWinner(){

// }