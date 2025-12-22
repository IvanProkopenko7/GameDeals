let matchingDeals = [];
function showHints(hints) {
  const hintsContainer = document.querySelector(".search-hints");
  hintsContainer.innerHTML = "";
  const hintList = hintsContainer.appendChild(document.createElement("ul"));
  hints.forEach((hint) => {
    const hintEl = hintList.appendChild(document.createElement("li"))
    hintEl.innerHTML = `<a href="index.html?gameID=${hint.gameID}">${hint.external}</a>`;
  });

}

function renderDeals(game) {
  const wrapper = document.querySelector(".wrapper");
  wrapper.innerHTML = "";
  game.deals.forEach((deal) => {
    const dealDiv = document.createElement("div");
    dealDiv.classList.add("deal");
    dealDiv.innerHTML = `
      <h2>${game.info.title}</h2>
      <p>Normal Price: $${deal.retailPrice}</p>
      <p>Sale Price: $${deal.price}</p>
      <p>Savings: ${parseFloat(deal.savings).toFixed(2)}%</p>
      <a href="https://www.cheapshark.com/redirect?dealID=${deal.dealID}" target="_blank">View Deal</a>
    `;
    wrapper.appendChild(dealDiv);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  //loading deals info based on url parameter
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const gameID = urlParams.get('gameID');

  // If there's a gameID in the URL, fetch and display that game
  if (gameID) {
    fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`)
      .then((response) => response.json())
      .then((gameInfo) => {
        renderDeals(gameInfo);
      })
      .catch((error) => console.error("Error fetching game info:", error));
  }
  //searching
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      if (searchTerm.length === 0) {
        showHints([]);
        return;
      }
      fetch(`https://www.cheapshark.com/api/1.0/games?title=${searchTerm}&limit=5`)
        .then((response) => response.json())
        .then((data) => {
          matchingDeals = data;
          const filteredHints = matchingDeals.filter((deal) =>
            deal.external.toLowerCase().includes(searchTerm)
          );
          showHints(filteredHints)
        })
        .catch((error) => console.error("Error fetching hints:", error));
    });
  }
});


/*
 1. pass all filter data to url
 2. read url parameters and make a fetch request with those parameters(apply default parameters if not provided)
*/
