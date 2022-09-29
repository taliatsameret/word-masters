const WORD_OF_DAY_URL = "https://words.dev-apis.com/word-of-the-day";
const VALID_WORD_URL = "https://words.dev-apis.com/validate-word";
const ANSWER_LENGTH=5;
let square = document.querySelectorAll(".square");
let loadingDiv = document.querySelector(".info-bar");
let guessWord = "";
let currentRow = 0;
let wordOfTheDay ="";
let wordParts ="";
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }
async function inputLetter(){
    const res = await fetch(WORD_OF_DAY_URL);
    const resObj = await res.json();
    wordOfTheDay= resObj.word.toUpperCase();
    wordParts = wordOfTheDay.split("");
    setLoading(false);
    document.addEventListener('keydown', function handleKeyPress(event) {
       const action = event.key;
       if (action === "Enter") {
           enter();
       }
       else if(action === "Backspace"){
            backspace();
       }
       else if(isLetter(action)){
           addLetter(action.toUpperCase());
       }
    });
}

function addLetter(letter){
    if(guessWord.length<5)
    {
        guessWord+=letter;
    }
    else{
    guessWord = guessWord.substring(0, guessWord.length-1)+letter;
    }
    square[ANSWER_LENGTH *currentRow+ guessWord.length-1].innerText = letter;
}
function backspace(){
    guessWord = guessWord.substring(0,guessWord.length-1);
    square[ANSWER_LENGTH * currentRow + guessWord.length].innerText = "";
}
async function enter(){
    if(guessWord.length===ANSWER_LENGTH){
        setLoading(true);
        const res = await fetch(VALID_WORD_URL, {
            method: "POST",
            body: JSON.stringify({word: guessWord})
        });
        const resObj = await res.json();
        setLoading(false);
        let valid = resObj.validWord;
        //let {validWord} =resObj;
        if(valid){
            if(guessWord ===wordOfTheDay){
                win();
            }
            else{
                markCorrectLetters();
                currentRow++;
            }
        } else{
            markRed();
        }
    }
}

function markCorrectLetters(){
    guessWord = "";
    alert("wrong word");
}
function markRed(){
    alert("invalid word");
}
function win(){
    alert("you win");
}
/**async function getDailyWord(){
    const res = await fetch(WORD_OF_DAY_URL);
    const resObj = await res.json();
    wordOfTheDay= resObj.word.toUpperCase();
    wordParts = wordOfTheDay.split("");
    setLoading(false);
}**/

function setLoading(isLoading) {
    loadingDiv.classList.toggle("hidden", !isLoading);
 }

/** async function isValidWord(word){
    const res = await fetch(VALID_WORD_URL, {
        method: "POST",
        body: JSON.stringify({word: word})
    });
    const resObj = await res.json();
    valid = resObj.validWord;
}**/

inputLetter();
