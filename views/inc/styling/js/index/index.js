// Kasper & Mie
document.addEventListener("DOMContentLoaded", async () => {
    await getAllIngredients();
    if(document.getElementById('alertInfo').innerText === "") {
        document.getElementById('alert').remove();
    }
});

let toggleDropdown = (elem) => {
    let content = elem.parentElement.getElementsByTagName('div')[0];
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

(getAllIngredients = async () => {
    try {

        let response = await fetch('/getAllIngredients');
        if (!response.ok) throw new Error('Response not ok');
        let ingredients = await response.json();


        let getAllShoppingLists = await fetch('/getShoppingLists');
        if(!getAllShoppingLists.ok) throw new Error('Response not ok');
        let allShoppingLists = await getAllShoppingLists.json();

        let shoppingLists = "";
        for(let i = 0; i < allShoppingLists.length; i++) {
            shoppingLists += `<option>${allShoppingLists[i].name}</option>`;
        }
        // asd
        createIngredientCards(ingredients, shoppingLists);
    } catch (e) {
        console.error('Fetch problem: ', e);
    }
})();

let createIngredientCards = (ingredients, shoppingLists) => {
    let div = document.getElementById('itemField');
    div.innerHTML = "";
    for(let i = 0; i < ingredients.length; i++) {
            let ingredient = ingredients[i];
            let item = document.createElement('div');
            item.className = "item";
            item.innerHTML = `
                <h1>${ingredient.name}</h1>
                <select name="option" class="w3-select w3-border" id="shoppingListOptions">
                    ${shoppingLists}
                </select>
                <input type="number" class="w3-input w3-border" placeholder="Mængde"/> 
                <button class="w3-btn w3-blue">Add Ingredient</button>

            `;
            div.appendChild(item);
        }
}

async function addToShoppingList(id) {
    try {
        let response = await fetch(`/addToCart/${productId}`);
        if (!response.ok) {
            throw new Error('Response not ok');
        }
        location.reload();
    } catch (e) {
        console.error('Error adding to cart: ', e);
    }
}

let fetchCategoriesAndItems = async (categoryName) => {
    try {
        let responseCategories = await fetch(`/getIngredientsByCategory/${categoryName}`);
        let items = await responseCategories.json();

        // Sort items alphabetically by name
        items = items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        createIngredientCards(items);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};



// Function to fetch and display all categories together
async function fetchAllCategoriesAndItems() {
    try {
        let response = await fetch('/getAllIngredients');
        let items = await response.json();

        // Sort items alphabetically by name
        items = items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        // Clear the itemField and append sorted/filtered items
        createIngredientCards(items, []);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



let toggleSideMenu = () => {
    let sideMenu = document.getElementById("sideMenu");
    sideMenu.classList.toggle("show");
}

let createShoppingList = async () => {
    let listName = prompt("Enter the name of the new shopping list:");
    if (listName) {
        let response = await fetch('/addShoppingList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: listName})
        });

        if(!response.ok) throw new Error('Response not ok');

        await showShoppingLists();
    }
}

(showShoppingLists = async () => {
    let response = await fetch('/getShoppingLists');
    if(!response.ok) throw new Error('Response not ok');

    let shoppingLists = await response.json();

    let par = document.getElementById('shoppingLists');
    par.innerHTML = "";
    for(let i = 0; i < shoppingLists.length; i++) {
        let elem = document.createElement('li');
        elem.innerText = shoppingLists[i].name;
        par.appendChild(elem);
    }
})();