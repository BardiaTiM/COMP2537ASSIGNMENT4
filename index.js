$(document).ready(function () {
    let numCards;
    const cards = [];
    const gameGrid = $('#game_grid');
    let timerId;

    function startTimer(duration, onTimeout) {
        let timer = duration;
        const timerElement = document.getElementById("timer-value");
      
        timerId = setInterval(function () {
          if (timer <= 0) {
            clearInterval(timerId);
            onTimeout();
          }
          timerElement.textContent = timer; // Update the timer value on the HTML page
          timer--;
        }, 1000);
      }

    

  
    function regenerateGame() {
        // Clear the previous game state
        gameGrid.empty();
        cards.length = 0;
      
        // Determine the card class based on the difficulty
        let cardClass;
        if (numCards === 6) {
          cardClass = 'card-easy';
        } else if (numCards === 12) {
          cardClass = 'card-medium';
        } else if (numCards === 24) {
          cardClass = 'card-hard';
        }
      
        // Generate new cards
        for (let i = 1; i <= numCards; i++) {
          cards.push({ id: `img${i}`, pokemon: null });
        }
      
        // Generate the card elements dynamically based on the cards array
        cards.forEach(card => {
          const cardElement = $('<div>').addClass('card').addClass(cardClass);  // Add the card class here
          const frontFace = $('<img>').attr('id', card.id).addClass('front_face').attr('alt', '');
          const backFace = $('<img>').addClass('back_face').attr('src', 'back.webp').attr('alt', '');
      
          cardElement.append(frontFace, backFace);
          gameGrid.append(cardElement);
        });
      
        // Populate the cards with random Pokemon images
        populateRandomPokemonImages();
      }
      
  
    $("#easy").on("click", function () {
      numCards = 6;
      time = 100;
      regenerateGame();
    });
  
    $("#medium").on("click", function () {
      numCards = 12;
      time = 200;
      regenerateGame();
    });
  
    $("#hard").on("click", function () {
      numCards = 24;
      time = 300;
      regenerateGame();
    });
  
    const setup = () => {
        let firstCard = undefined;
        let secondCard = undefined;
        let isChecking = false;
        let matches = 0;
        let pairsLeft = numCards / 2;
        let attempts = 0;
        
        
        function resetGame() {
            // Reset variables
            firstCard = undefined;
            secondCard = undefined;
            isChecking = false;
            matches = 0;
            pairsLeft = numCards / 2; // Update pairsLeft based on the number of cards
            attempts = 0;
          
            // Reset card flips
            $(".card").removeClass("flip");
          
            // Re-enable card clicks
            $(".card").on("click");
          
            // Update all displays
            updateAll();
          
            // Reset and stop the timer
            clearInterval(timerId);
            const timerElement = document.getElementById("timer-value");
            timerElement.textContent = "100"; // Update the timer value to the initial value (60 seconds) or your desired value
          }
          
        
          // Event handler for the "Reset Game" button
          $("#reset").on("click", function () {
            resetGame();
          });
    
          function startGame() {
            // Hide the Start Game button
            $("#start").hide();
      
            // Show the game grid
            gameGrid.show();
      
            // Set up the game
            setup();
          }
      
          // Event handler for the "Start Game" button
          $("#start").on("click", function () {
            startGame();
            startTimer(time, onTimeout);
          });
          function onTimeout() {
            alert("You lost!"); // Display an alert when the timer runs out
            resetGame(); // Reset the game after the timeout
            $("#start").show();
          }

          function wonGame() {
            alert("You won!");
            resetGame();
            $("#start").show();
            }
    
          
        //function to update the score
          function updateScore() {
            document.getElementById("score").innerHTML = "Number of pairs left: " + matches;
        }

        function updateNumberCards() {
            document.getElementById("numcards").innerHTML = "Total Number of Pairs " + numCards /2;
        }
    
        //function to update the attempts
        function updateAttempts() {
            document.getElementById("attempts").innerHTML = "Number of Clicks: " + attempts;
        }
    
        //function to update the pairs left
        function updatePairsLeft() {
            document.getElementById("pairsLeft").innerHTML = "Number of pairs left: " + pairsLeft;
        }
    
        //function that calls all the update functions
        function updateAll() {
            updateNumberCards();
            updateScore();
            updateAttempts();
            updatePairsLeft();
        }

        function revealAllCards() {
            $(".card:not(.flip)").addClass("flip");
        }
        
        let powerUpActive = false;
        let lastMatchTime = null;
        $(".card").on("click", function () {
          if ($(this).hasClass("flip") || isChecking) {
            // Prevent clicking on a flipped card or during card comparison
            return;
          }


          function checkPowerUp() {
            if (powerUpActive && matches % 2 === 0) {
              const $unflippedCards = $(".card:not(.flip)");
          
              $unflippedCards.addClass("flip");
          
              setTimeout(function () {
                $unflippedCards.removeClass("flip");
                powerUpActive = false;
              }, 1000); // 1-second reveal duration
            }
          }
    
          $(this).toggleClass("flip");
    
          if (!firstCard) {
            firstCard = $(this).find(".front_face")[0];
          } else if (!secondCard) {
            secondCard = $(this).find(".front_face")[0];
            console.log(firstCard, secondCard);
    
            if (firstCard.src == secondCard.src) {
                console.log("match");
                $(`#${firstCard.id}`).parent().off("click");
                $(`#${secondCard.id}`).parent().off("click");
                matches++;
                pairsLeft--;
                attempts++;
            
                const currentTime = new Date().getTime();
                if (lastMatchTime && (currentTime - lastMatchTime) <= 10000) {
                    powerUpActive = true;
                    console.log("power up activated");
                    checkPowerUp();
                }
                lastMatchTime = currentTime;
            
                if (pairsLeft === 0) {
                    setTimeout(function () {
                        wonGame();
                    }, 1000); // 2-second delay (2000 milliseconds)
                }
            
                // Reset the first and second cards
                firstCard = undefined;
                secondCard = undefined;
            } else {
              console.log("no match");
              isChecking = true;
              attempts++;
    
              setTimeout(() => {
                $(`#${firstCard.id}`).parent().toggleClass("flip");
                $(`#${secondCard.id}`).parent().toggleClass("flip");
    
                isChecking = false;
    
                // Reset the first and second cards
                firstCard = undefined;
                secondCard = undefined;
              }, 1000);
            }
          }
          updateAll();
    
        });
        function checkPowerUp() {
            if (powerUpActive && matches % 2 === 0) {
              setTimeout(function () {
                hideAllCards();
                powerUpActive = false;
              }, 1000); // 1-second reveal duration
            }
          }

          function hideAllCards() {
            $(".card:not(.match)").removeClass("flip");
        }
        
      };
  
      function getRandomPokemon() {
        const randomOffset = Math.floor(Math.random() * 898);
        const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=1&offset=${randomOffset}`;
    
        return $.get(apiUrl);
      }
  
      function setPokemonImage(card, imageUrl) {
        const imgElement = document.getElementById(card.id);
        imgElement.src = imageUrl;
      }
  
      function populateRandomPokemonImages() {
        const promises = [];
    
        const randomPokemonIndexes = getRandomUniqueIndexes(cards.length);
    
        for (let i = 0; i < randomPokemonIndexes.length; i += 2) {
          const index1 = randomPokemonIndexes[i];
          const index2 = randomPokemonIndexes[i + 1];
    
          promises.push(
            getRandomPokemon().done(function (data) {
              const pokemon = data.results[0];
              const pokemonUrl = pokemon.url;
    
              $.get(pokemonUrl, function (pokemonData) {
                const imageUrl = pokemonData.sprites.front_default;
                setPokemonImage(cards[index1], imageUrl);
                setPokemonImage(cards[index2], imageUrl);
              });
            })
          );
        }
    
        $.when.apply($, promises).done(function () {
          console.log("All Pokémon images loaded.");
          setup();
        });
      }
  
      function getRandomUniqueIndexes(max) {
        const indexes = [];
    
        while (indexes.length < max) {
          const randomIndex = Math.floor(Math.random() * max);
          if (!indexes.includes(randomIndex)) {
            indexes.push(randomIndex);
          }
        }
    
        return indexes;
      }
  
    // Set default difficulty and start the game
    numCards = 6;
    time = 100;
    regenerateGame();

    document.getElementById("colorButton").addEventListener("click", function() {
        var body = document.body;
        
        if (body.style.backgroundColor === "black") {
          body.style.backgroundColor = "white";
          body.style.color = "black";
        } else {
          body.style.backgroundColor = "black";
          body.style.color = "white";
        }
      });
      
      
  });
  