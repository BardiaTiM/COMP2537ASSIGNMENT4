$(document).ready(function () {
    let numCards;
    const cards = [];
    const gameGrid = $('#game_grid');
  
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
      regenerateGame();
    });
  
    $("#medium").on("click", function () {
      numCards = 12;
      regenerateGame();
    });
  
    $("#hard").on("click", function () {
      numCards = 24;
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
          });
    
          
        //function to update the score
          function updateScore() {
            document.getElementById("score").innerHTML = "Score: " + matches;
        }
    
        //function to update the attempts
        function updateAttempts() {
            document.getElementById("attempts").innerHTML = "Attempts: " + attempts;
        }
    
        //function to update the pairs left
        function updatePairsLeft() {
            document.getElementById("pairsLeft").innerHTML = "Pairs Left: " + pairsLeft;
        }
    
        //function that calls all the update functions
        function updateAll() {
            updateScore();
            updateAttempts();
            updatePairsLeft();
        }
        
    
        $(".card").on("click", function () {
          if ($(this).hasClass("flip") || isChecking) {
            // Prevent clicking on a flipped card or during card comparison
            return;
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
          });
    
        });
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
    regenerateGame();
  });
  