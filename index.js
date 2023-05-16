$(document).ready(function() {
    const setup = () => {
        let firstCard = undefined;
        let secondCard = undefined;
        let isChecking = false;
        let matches = 0;
        let pairsLeft = 6;
        let attempts = 0;
      
        $(".card").on("click", function() {
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
      
              // Reset the first and second cards
              firstCard = undefined;
              secondCard = undefined;
            } else {
              console.log("no match");
              isChecking = true;
      
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
        });
      };
      

  const cards = [
    { id: "img1", pokemon: null },
    { id: "img2", pokemon: null },
    { id: "img3", pokemon: null },
    { id: "img4", pokemon: null },
    { id: "img5", pokemon: null },
    { id: "img6", pokemon: null }
  ];

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
  
  populateRandomPokemonImages();
});
