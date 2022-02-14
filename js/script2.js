(function (){

    //STEN SAX PÅSE THE GAME
    let pScore = 0;
    let cScore = 0;

    const playerimg = document.getElementById(`pimg`);
    const computerimg = document.getElementById(`cimg`);

    document.getElementById(`name`).addEventListener("click", displayPlayerName);
    document.getElementById(`sten`).addEventListener("click", playerSten);
    document.getElementById(`sax`).addEventListener("click", playerSax);
    document.getElementById(`pase`).addEventListener("click", playerPase);

    getHighscore();

    function displayPlayerName(){
        const input = document.querySelector(`input`);
        const displayPlayerName = document.querySelector(`h2`);
    
        displayPlayerName.innerText = input.value;
        input.value = ` `;
    }

    //Function Datorn Random sten sax eller påse nr 0-2
    function randomChoices (){
        const aiChoices = [`sten`, `sax`, `påse`];
        const randomIndex = Math.floor( Math.random()*aiChoices.length);

        const result = document.getElementById(`compResult`);

        return aiChoices[randomIndex];
    }

    function playerSten(){
        playerimg.src = `img/sten.png`;
        playerimg.alt = `sten`;

        checkWinner();
        endGame();
    };

    function playerSax(){
        playerimg.src = `img/sax.png`;
        playerimg.alt = `sax`;

        checkWinner();
        endGame();
    };

    function playerPase(){
        playerimg.src = `img/påse.png`;
        playerimg.alt = `påse`;
        
        checkWinner();
        endGame();
    };

    function updateScore(event){
        const playerScore = document.getElementById(`playerScore`);
        const computerScore = document.getElementById(`computerScore`);
        playerScore.textContent = pScore;
        computerScore.textContent = cScore;
    };

    function checkWinner(){
        const compChoice = randomChoices();
        computerimg.src = `img/${compChoice}.png`
        const playerChoice = document.getElementById(`playerResult`).firstChild.alt;

        if(compChoice === playerChoice){
            announcment.innerText = `Oavgjort`;
            announcment.style.color = `white`;
            
        }
        else if (playerChoice == `sten`){
            if(compChoice == `påse`){
                computerWinText();
                cScore++;
                updateScore(); 
        }else{
                playerWinText();
                pScore++;
                updateScore();
            }
        }
        else if(playerChoice == `sax`){
            if(compChoice == `sten`){
                computerWinText();
                cScore++;
                updateScore();

        }else{
                playerWinText();
                pScore++;
                updateScore();
            }
        }
        else if(playerChoice == `påse`){
            if(compChoice == `sax`){
                computerWinText();
                cScore++;
                updateScore();
            }else{
                playerWinText();
                pScore++;
                updateScore();
            }
        }
        endGame();

    }

    function computerWinText(){
        announcment.innerText = `CPU +1`;
        announcment.style.color = `hsl(2, 81%, 74%)`;
    }

    function playerWinText(){
        announcment.innerText = `+1`;
        announcment.style.color = `hsl(129, 48%, 57%)`;
    }

    function endGame(event){
        if(cScore === 1){
            compareScore();
            alert(`Du förlorade din fajt efter att ha vunnit mot ${pScore} motståndare.`)
            cScore = 0;
    
            playerScore.textContent = 0;
            computerScore.textContent = 0;
            announcment.innerText = `FAJT, FAJT, FAJT!`;
            announcment.style.color = `white`;
            
            removeOldHighscore();
            
            const getNewHighscore = function(){
                pScore = 0;
                getHighscore();
            };

            setTimeout(getNewHighscore, 200);            
        } 
    } 

    function removeOldHighscore(){
        const divAll = document.querySelectorAll(`div`);
        for(let i = 5; i<divAll.length; i++){
            const all = divAll[i];
            all.remove();
        } 
    }

//DATABASEN + HIGHSCORE

    function compareScore(){
        const highscoreUrl = `https://highscore-29947-default-rtdb.europe-west1.firebasedatabase.app/highscore.json`;
        const scorePromise = fetch(highscoreUrl);
        const jsonPromise = scorePromise.then(
            function(promiseValue){
                return promiseValue.json();
            }
        );
        jsonPromise.then(
            function(scoreArray){
    
                const displayPlayerName = document.querySelector(`h2`);
                playerName = displayPlayerName.innerText;
    
                let customId;
                let newArray; 
                // console.log(pScore);
                for(let i = 0; i < scoreArray.length; i++){
                    
                    if (pScore >= scoreArray[i].score){
                        // console.log(`${pScore} ska in på highscore index`, scoreArray.indexOf(scoreArray[i]))
    
                        customId = scoreArray.indexOf(scoreArray[i]);
                        // (console.log(customId))
                        
                        break;
                    }else{
                        // console.log(`${pScore} ska ej in på highscore index`, scoreArray.indexOf(scoreArray[i]))
                    }
                }
    
                //Arrayen ändras om
                newArray = scoreArray;
                newArray.splice(customId, 0, Object = {
                    player: playerName,
                    score: pScore
                });
                newArray.pop();
                // console.log(newArray)
    
                //Uppdatera URL beroende på index
                for(i = customId; i < 5; i++){
                   const url = `https://highscore-29947-default-rtdb.europe-west1.firebasedatabase.app/highscore/${i}.json`; 
    
                   const headerObject = {
                    'Content-type': 'application/json; charset=UTF-8',
                    }
                   
                   const init = {
                    method: `PUT`,
                    body: JSON.stringify(newArray[i]),
                    headers: headerObject,
                   }
    
                   fetch(url, init).then(r=>r.json()).then(d=>console.log(`Posted new scoreboard`, d));
                }
            }
        )
    }
    
    //Funktion för att hämta highscore och skriva ut det i DOM:en
    function getHighscore(){
        const highscoreUrl = `https://highscore-29947-default-rtdb.europe-west1.firebasedatabase.app/highscore.json`;
        const scorePromise = fetch(highscoreUrl);
        
        const jsonPromise = scorePromise.then(
            function(promiseValue){
                return promiseValue.json();
            }
        );
        // console.log(jsonPromise);
        
        jsonPromise.then(
            function(promiseValue){
                // console.log(`Porimise i variabler`, promiseValue);
    
                for(let i = 0; i < promiseValue.length; i++){
    
                    const div = document.getElementById(`scoreBoard`);
                    const newDiv = document.createElement(`div`);
                    const h2 = document.createElement(`h2`);
                    const p = document.createElement(`p`);
    
                    newDiv.classList.add(`playerScore`);
                    
                    h2.innerText = promiseValue[i].player;
                    p.innerText = promiseValue[i].score;
                    
                    div.appendChild(newDiv);
                    newDiv.appendChild(h2);
                    newDiv.appendChild(p);
    
                }
            }
        );
    }

} )();
