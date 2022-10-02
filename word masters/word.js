const WORD_OF_DAY_URL = "https://words.dev-apis.com/word-of-the-day";
const VALID_WORD_URL = "https://words.dev-apis.com/validate-word";
const ANSWER_LENGTH=5;
const ROUNDS = 6;
let square = document.querySelectorAll(".square");
let header = document.querySelector(".header");
let loadingDiv = document.querySelector(".info-bar");
let isLoading =true;
let guessWord = "";
let currentRow = 0;
let wordOfTheDay ="";
let wordOfTheDayParts ="";
let guessWordParts = "";
let done = false;


inputLetter();

 // listening for event keys and routing to the right function
  // we listen on keydown so we can catch Enter and Backspace
async function inputLetter(){
    const res = await fetch(WORD_OF_DAY_URL);
    const resObj = await res.json();
    wordOfTheDay= resObj.word.toUpperCase();
    wordOfTheDayParts = wordOfTheDay.split("");
    isLoading=false;
    setLoading(isLoading);
    document.addEventListener('keydown', function handleKeyPress(event) {
        if (done || isLoading) {
            // do nothing;
            return;
          }
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
function backspace(){
    guessWord = guessWord.substring(0,guessWord.length-1);
    square[ANSWER_LENGTH * currentRow + guessWord.length].innerText = "";
}

function addLetter(letter){
    if(guessWord.length<ANSWER_LENGTH){
        guessWord+=letter;
    }
    else{
    guessWord = guessWord.substring(0, guessWord.length-1)+letter;
    }
    square[ANSWER_LENGTH *currentRow+ guessWord.length-1].innerText = letter;
}

async function enter(){
    if(guessWord.length===ANSWER_LENGTH){
        isLoading=true;
        setLoading(isLoading);
        const res = await fetch(VALID_WORD_URL, {
            method: "POST",
            body: JSON.stringify({word: guessWord})
        });
        const resObj = await res.json();
        let valid = resObj.validWord;
        //let {validWord} =resObj;
        isLoading=false;
        setLoading(isLoading);
        if(valid){
            if(guessWord === wordOfTheDay){
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
    guessWordParts = guessWord.split("");
    const map = makeMap(wordOfTheDayParts);
    for(let i=0; i<ANSWER_LENGTH; i++){
        if(guessWordParts[i] ===  wordOfTheDayParts[i]){
            square[ANSWER_LENGTH * currentRow +i].classList.add("correct");
            map[guessWordParts[i]]--;
        }
        else if(wordOfTheDayParts.includes(guessWordParts[i]) && map[guessWordParts[i]] > 0){
            square[ANSWER_LENGTH * currentRow +i].classList.add("close");
            map[guessWordParts[i]]--;
        }
        else{
            square[ANSWER_LENGTH * currentRow +i].classList.add("worng");
        }
    }
    guessWord = "";
}
function markRed(){
    for(let i=0; i<ANSWER_LENGTH; i++){
        square[ANSWER_LENGTH * currentRow +i].classList.remove("invalid");
        setTimeout(
            () => square[currentRow * ANSWER_LENGTH + i].classList.add("invalid"),
            10
          );
    }
}
function win(){
    for(let i=0; i<ANSWER_LENGTH; i++){
        square[ANSWER_LENGTH * currentRow +i].classList.add("correct");
    }
    header.classList.add("win");
    done = true;
    if (currentRow === ROUNDS) {
        // lose
        done = true;
      }
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }

function setLoading(isLoading) {
    loadingDiv.classList.toggle("hidden", !isLoading);
 }

 function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
      if (obj[array[i]]) {
        obj[array[i]]++;
      } else {
        obj[array[i]] = 1;
      }
    }
    return obj;
  }
  
 
/**async function getDailyWord(){
    const res = await fetch(WORD_OF_DAY_URL);
    const resObj = await res.json();
    wordOfTheDay= resObj.word.toUpperCase();
    wordParts = wordOfTheDay.split("");
    setLoading(false);
}**/

/** async function isValidWord(word){
    const res = await fetch(VALID_WORD_URL, {
        method: "POST",
        body: JSON.stringify({word: word})
    });
    const resObj = await res.json();
    valid = resObj.validWord;
}**/

