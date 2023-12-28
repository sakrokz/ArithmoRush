
import './confetti.js'

const hero = document.querySelector('.hero')
const nums = document.querySelectorAll('.num')
const work = document.querySelector('.work-elm-ul')
const opers = document.querySelectorAll('.opers')
const targetNumElm = document.getElementById('target-num')
const answerMainElement = document.getElementById('answer-main');
const clearBtn = document.getElementById('clear')
const nextBtn = document.getElementById('next')
const level = document.getElementById('lvl')
const howBtn = document.getElementById('how')
const howMain = document.querySelector('.how-to')
const playMain = document.querySelector('.main')
const cong = document.getElementById('congg')
const scoreElm = document.getElementById('scr')

// animated gradient background

document.addEventListener('DOMContentLoaded', () => {
    let i = 0;

    const changeBackground = () => {
        hero.style.backgroundImage = `linear-gradient(${i}deg, #456FE8, #19B0EC)`;
        i++;

        if (i <= 1000000) {
            setTimeout(changeBackground, 50); // Adjust the delay in milliseconds (e.g., 10)
        }
    };

    changeBackground(); // Start the animation
});

//score time initializer
let startTime = new Date().getTime()


// onclick appear in work area

nums.forEach(num => {
    num.addEventListener('click', () => cloner(num))
})

function cloner(elm){
    let clone = elm.cloneNode(true)

    clone.style.float = "left"
    clone.style.marginLeft = "20px"
    clone.style.marginBottom = "20px"
    clone.style.fontSize = "1.7rem"
    clone.style.border = "2px solid #fff"
    clone.style.padding = "10px"
    clone.style.borderRadius = "10px"
    clone.style.width = "70px"
    clone.style.height = "70px"
    clone.style.textAlign = "center"
    clone.style.cursor = "pointer"
    clone.style.transition = ".4s all ease"
    clone.style.webkitUserSelect = "none"
    clone.style.userSelect = "none"

    work.appendChild(clone)

    elm.style.visibility = "hidden"
    elm.style.pointerEvents = "none"
}

opers.forEach(oper => {
    oper.addEventListener('click', () => cloner(oper))
})


// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

// real time calculations

// limit for generating random numbers, increases on level increase
let limit = 6

// Function to generate a target number based on patterns
function generateTargetNumber() {
    // Define a set of patterns
    const patterns = [
        ['+', '-', '*'],
        ['+', '-', '/'],
        ['+', '*', '/'],
        ['-', '*', '/'],
        ['+', '-', '*'],
        ['+', '-', '/'],
        ['+', '*', '/'],
        ['-', '*', '/'],
        ['+', '*', '-'],
        ['-', '*', '+'],
        ['/', '*', '-'],
        ['+', '*', '-'],
        ['-', '+', '*'],
        ['/', '+', '*'],
        ['/', '-', '*'],
        ['/', '*', '+'],
        ['-', '+', '*'],
        ['/', '+', '-'],
        ['/', '-', '+'],
        ['-', '*', '+'],
        ['/', '*', '-'],
        ['*', '+', '-'],
        ['*', '-', '+'],
        ['*', '/', '-'],
        ['*', '/', '+']
    ];

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    // Choose a random pattern from the set
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];

    // Generate random numbers for the buttons
    const randomNumbers = [];
    for (let i = 0; i < 4; i++) {
        randomNumbers.push(getRandomNumber(1, limit));
    }

    let shuffledArrayMain = shuffleArray(randomNumbers);

    nums.forEach((num, index) => {
        num.textContent = shuffledArrayMain[index];
    });

    // Initialize the target number with the first random number
    let targetNumber = randomNumbers[0];
    let expression = randomNumbers[0].toString(); // Start the expression with the first number

    // Apply the chosen pattern to calculate the target number
    for (let i = 0; i < randomPattern.length; i++) {
        const operator = randomPattern[i];
        let nextNumber;

        // Use the current index to access the next number in randomNumbers array
        nextNumber = randomNumbers[i + 1];

        if (operator === '/' && targetNumber % nextNumber !== 0) {
            // Skip division and choose an alternative operator
            console.warn('Skipped division as it is not a perfect divisible. Choosing an alternative operator.');
            const alternativeOperator = getAlternativeOperator(randomPattern);
            switch (alternativeOperator) {
                case '+':
                    targetNumber += nextNumber;
                    expression += ` + ${nextNumber}`;
                    break;
                case '-':
                    targetNumber -= nextNumber;
                    expression += ` - ${nextNumber}`;
                    break;
                case '*':
                    targetNumber *= nextNumber;
                    expression += ` * ${nextNumber}`;
                    break;
                default:
                    console.error('Invalid alternative operator:', alternativeOperator);
                    break;
            }
        } else {
            // Update the expression based on the original operator and next number
            switch (operator) {
                case '+':
                    targetNumber += nextNumber;
                    expression += ` + ${nextNumber}`;
                    break;
                case '-':
                    targetNumber -= nextNumber;
                    expression += ` - ${nextNumber}`;
                    break;
                case '*':
                    targetNumber *= nextNumber;
                    expression += ` * ${nextNumber}`;
                    break;
                case '/':
                    // Division is a perfect divisible, proceed
                    targetNumber /= nextNumber;
                    expression += ` / ${nextNumber}`;
                    break;
                default:
                    console.error('Invalid operator:', operator);
                    break;
            }
        }
    }

    targetNumElm.textContent = targetNumber

    // console out expression and target number (if u dont know the answer LOL!)
    console.log("expression: ", expression)
    console.log(targetNumber)

    // Return the generated target number
    return targetNumber;

    // Function to get an alternative operator not in the selected pattern
    function getAlternativeOperator(pattern) {
        const allOperators = ['+', '-', '*', '/'];
        return allOperators.find(operator => !pattern.includes(operator)) || '+';
    }

}

// score function

const initialTimeBonus = 100; 
const timeBonusDecreaseRate = 0.002;

function calculateScore() {
    const endTime = new Date().getTime();
    const timeTaken = endTime - startTime;

    // Assign points based on the level number 
    const levelPoints = lvlNum * 100;

    // Calculate time bonus 
    let timeBonus = Math.max(0, initialTimeBonus - timeTaken * timeBonusDecreaseRate);
    let mainTimeBonus = timeBonus.toFixed(2)

    // Calculate the total score
    const totalScore = levelPoints + parseFloat(mainTimeBonus);

    return totalScore;
}



let targetNumber = generateTargetNumber()
let currentExpression = '';

function handleButtonClick(value) {

    currentExpression += value;
    updateDisplay();
}

function updateDisplay() {
    try {
        const currentResult = eval(currentExpression);
        answerMainElement.textContent = '= ' + currentResult;
        currentExpression = currentResult.toString(); // Replace the expression with its result

        // Convert currentResult and targetNumber to numbers for accurate comparison
        const currentResultNum = Number(currentResult);
        const targetNumberNum = Number(targetNumber);

        // Check if the current result matches the stored target number
        if (currentResultNum === targetNumberNum) {
            // Enable the Next Level button
            nextBtn.style.backgroundColor = "#1845ca";
            nextBtn.style.opacity = "1";
            nextBtn.style.pointerEvents = "auto";
            setTimeout(() => {
                startConfetti()
                // congrats message
                cong.style.animation = "hb .5s ease forwards"
            }, 300)
            setTimeout(() => {
                stopConfetti()
            }, 3000);

            //score calculater
            const currentScore = calculateScore()
            scoreElm.textContent = currentScore

        } else {
            // If the answer is incorrect, reset the button styles
            nextBtn.style.backgroundColor = "#ccc";
            nextBtn.style.opacity = "0.5";
            nextBtn.style.pointerEvents = "none";
        }
    } catch (error) {
        answerMainElement.textContent = '=';
    }
}

// Event listeners for number buttons
nums.forEach((num) => {
    num.addEventListener('click', () => handleButtonClick(num.textContent));
});

// Event listeners for operator buttons
opers.forEach((oper) => {
    oper.addEventListener('click', () => handleButtonClick(oper.textContent));
});


//clear button for clearing work area

clearBtn.addEventListener('click', () => {
    while (work.firstChild) {
        work.removeChild(work.firstChild);
        opers.forEach(oper => {
            oper.style.visibility = "visible"
            oper.style.pointerEvents = "auto"
        })
        nums.forEach(num => {
            num.style.visibility = "visible"
            num.style.pointerEvents = "auto"
        })
        answerMainElement.textContent = '= '
        currentExpression = ''
    }
})

// if the next button is clicked increase limit of random number generation

nextBtn.addEventListener('click', () => {
    nextBtnCall()
})

let lvlNum = 1

function nextBtnCall(){

    lvlNum += 1
    level.textContent = lvlNum
    
    limit += 3

    //set new startTime
    startTime = new Date().getTime()

    // change styles of next button to disabled

    nextBtn.style.backgroundColor = "#ccc";
    nextBtn.style.opacity = "0.5";
    nextBtn.style.pointerEvents = "none";

    targetNumber = generateTargetNumber()

    //reset nums and opers to default positions

    while (work.firstChild) {
        work.removeChild(work.firstChild);
        opers.forEach(oper => {
            oper.style.visibility = "visible"
            oper.style.pointerEvents = "auto"
        })
        nums.forEach(num => {
            num.style.visibility = "visible"
            num.style.pointerEvents = "auto"
        })
        answerMainElement.textContent = '= '
        currentExpression = ''
    }

    //congrats display to invis

    cong.style.animation = "none"

}

//HOW to PLAYYYYYYYYYY

howBtn.addEventListener('click', () => {
    howMain.classList.toggle('how-active')
    playMain.classList.toggle('play-active')
    howBtn.classList.toggle('how-btn-active')
})


