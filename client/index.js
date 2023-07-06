//Constants
const ROOT = document.getElementById("root");
const CARDS_CONTAINER = document.getElementById("cardsContainer");
const SEARCHBAR = document.getElementById("searchBar");
const SEARCHBARBTN = document.getElementById("searchBarBtn");
const SELECT_TYPE = document.getElementById("selectType");
const SELECT_SORT = document.getElementById("selectSort");
const SELECT_ATTRIBUTE = document.getElementById("selectAttribute");
const SELECT_RACE = document.getElementById("selectRace");
const SELECT_ORDER = document.getElementById("selectOrder");
const APPLY_BTN = document.getElementById("applyBtn");
const PREV_BTN = document.getElementById("prevBtn");
const NEXT_BTN = document.getElementById("nextBtn");
const ENDPOINT_BASE = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

//Variables
let offset = 0;
let cardsPerPage = 12;
let type = "";
let sort = "";
let attribute = "";
let race = "";
let order = "";


//Functions
/**
 * It is used to generate a complete endpoint.
 * @param {String} baseUrl - YuGiOh API url base.
 * @param {String | undefined} sort - Characteristic by which cards will be sorted.
 * @param {String | undefined} attribute - Attribute by which cards will be filtered.
 * @param {String | undefined} race - Race by which cards will be filtered.
 * @param {Number | String} cardsPerPage - Number of cards per page.
 * @param {Number | String} offset - Index from which cards are displayed.
 * @param {String | undefined} type -
 * @param {String | undefined} order -
 * 
 * @returns {String}
 */
function endpointCreator(baseUrl, cardsPerPage, offset, type, sort, attribute, race, order){
    if(!baseUrl) return "https://db.ygoprodeck.com/api/v7/cardinfo.php";

    let endpoint = baseUrl.concat(`?num=${cardsPerPage}&offset=${offset}`);

    if(type) endpoint += `&type=${type}`;
    if(sort) endpoint += `&sort=${sort}`;
    if(attribute) endpoint += `&attribute=${attribute}`;
    if(race) endpoint += `&race=${race}`;
    if(order) endpoint += `&sortorder=${order}`
    
    return endpoint;

}
/**
 * It is used to get the api data.
 * 
 * Renders the data in the DOM.
 * @param {String | URL} endpoint 
 */
function getCards(endpoint) {
    fetch(endpoint)
        .then(response => response.json())
        .then(result => {
            CARDS_CONTAINER.innerHTML = "";
            
            result.data.forEach(card => {
                let divTagCard = document.createElement("div");
                let imgTagCard = document.createElement("img");

                divTagCard.appendChild(imgTagCard);
                divTagCard.setAttribute("class", "card");
                divTagCard.setAttribute("key", `${card.id}`);
                imgTagCard.setAttribute("src", `${card.card_images[0].image_url}`)
                imgTagCard.setAttribute("alt", `${card.name}`)

                CARDS_CONTAINER.appendChild(divTagCard);
            });
        })
        .catch(() => {
            CARDS_CONTAINER.innerHTML = `<p>not found</p>`
        })
}

/**
 * It is used to get a only one card from the api.
 * 
 * Calls "getCards" function.
 * @param {String} name 
 */
function searchCard(name){
    if(SEARCHBAR.value) getCards(ENDPOINT_BASE.concat(`?name=${name}`));
    else getCards(ENDPOINT_BASE.concat(`?num=${cardsPerPage}&offset=${offset}`));   
}

//Event Listeners
SEARCHBARBTN.addEventListener("click", () => {
    const NAME = SEARCHBAR.value;
    searchCard(NAME);
})

SELECT_TYPE.addEventListener("change", (event) => {
    type = event.target.value;
})

SELECT_SORT.addEventListener("change", (event) => {
    sort = event.target.value;
})

SELECT_ATTRIBUTE.addEventListener("change", (event) => {
    attribute = event.target.value;
})

SELECT_RACE.addEventListener("change", (event) => {
    race = event.target.value;
})

SELECT_ORDER.addEventListener("change", (event) => {
    order = event.target.value;
})

APPLY_BTN.addEventListener("click", () => {
    let endpoint = endpointCreator(ENDPOINT_BASE, cardsPerPage, 0, type, sort, attribute, race, order)
    getCards(endpoint);
})

PREV_BTN.addEventListener("click", () => {
    if (offset >= cardsPerPage) {
        offset -= cardsPerPage;
        
        let endpoint = endpointCreator(ENDPOINT_BASE, cardsPerPage, offset, type, sort, attribute, race, order)
        getCards(endpoint);
    }

})

NEXT_BTN.addEventListener("click", () => {
    offset += cardsPerPage;

    let endpoint = endpointCreator(ENDPOINT_BASE, cardsPerPage, offset, type, sort, attribute, race, order)
    getCards(endpoint);
})


//Calls
getCards(ENDPOINT_BASE.concat(`?num=${cardsPerPage}&offset=${offset}`));