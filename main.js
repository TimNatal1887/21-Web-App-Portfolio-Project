const wagerForm = document.querySelector(".wager")
const cardLis = ""
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
    startGame()
    
    
    
    
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

function startGame(){
    const points = document.querySelector("#points").value
    const wagerAmount = document.querySelector(".wager-amount")

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
    newCard.innerHTML = `<img src="${card.image}" alt="">`
}