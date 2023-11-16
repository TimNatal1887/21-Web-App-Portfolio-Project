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
        startGame(data.cards)
    })
})
    
    
    
    

holdButton.addEventListener("submit",(event)=>{
    event.preventDefault()
})

holdButton.addEventListener("submit",(event)=>{
    event.preventDefault()    
})

restartButton.addEventListener("submit",(event)=>{
    event.preventDefault()
})

function startGame(cards){
    const points = document.querySelector("#points").value
    const wagerAmount = document.querySelector(".wager-amount")
    const playerHand = document.querySelector(".players-hand")
    const dealerHand = document.querySelector(".dealers-hand")
    // const dealerCount = randomDealer()
    const playerCount = cardCounter(cards)
    console.log(playerCount)
    
    
    drawButton.style.display = "inline"
    holdButton.style.display = "inline"
    wagerForm.style.display ="none"
    restartButton.style.display = "inline"
    ruleText.style.display = "inline"
    wagerAmount.textContent = `Wager Amount : ${points}`
    dealerHand.textContent += `Dealer's Hand: 17 `
    playerHand.textContent += `Player's Hand: ${playerCount}`
    
    
    
}



function displayCard(card){
    const newCard = document.createElement("li");
    newCard.classList.add("card");
    newCard.value = `${card.value}`
    newCard.innerHTML = `<img src="${card.image}" alt="">`
    cardList.append(newCard)
    
}

function cardCounter(cards){
    let aceCount = 0
    let playerCount = 0
    cards.forEach(card=> {
        const cardValue = card.value
        console.log(cardValue)
        if(cardValue === "KING" || cardValue === "QUEEN" || cardValue === "JACK"){
            playerCount += 10
        }else if(cardValue === "ACE"){
            aceCount++
            playerCount += 11
            
        }else{
            playerCount += +cardValue
        }
    })

    while(playerCount > 21 && aceCount > 1){
        playerCount -= 10
        aceCount--
    }

    return playerCount

}