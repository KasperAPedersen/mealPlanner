// Kasper, Mie & Anya
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

        // asd
        await createIngredientCards(ingredients);
    } catch (e) {
        console.error('Fetch problem: ', e);
    }
})();

let createIngredientCards = async (ingredients) => {
    let div = document.getElementById('itemField');
    div.innerHTML = "";

    // Get shopping lists
    let getAllShoppingLists = await fetch('/getShoppingLists');
    if(!getAllShoppingLists.ok) throw new Error('Response not ok');
    let allShoppingLists = await getAllShoppingLists.json();

    let shoppingLists = "";
    for(let i = 0; i < allShoppingLists.length; i++) {
        shoppingLists += `<option>${allShoppingLists[i].name}</option>`;
    }

    // Get units
    let getAllUnits = await fetch('/getAllUnits');
    if(!getAllUnits.ok) throw new Error('Response not ok');
    let allUnits = await getAllUnits.json();

    let units = "";
    for(let i = 0; i < allUnits.length; i++) {
        units += `<option>${allUnits[i].name}</option>`;
    }

    for(let i = 0; i < ingredients.length; i++) {
            let ingredient = ingredients[i];
            let item = document.createElement('div');
            item.className = "item";
            item.innerHTML = `
                <h1>${ingredient.name}</h1>
                <select name="option" class="w3-select w3-border">
                    <option hidden selected disabled>Unit</option>
                    ${units}
                </select>
                <input type="number" class="w3-input w3-border" placeholder="Mængde"/> 
                <select name="option" class="w3-select w3-border">
                    <option hidden selected disabled>List</option>
                    ${shoppingLists}
                </select>
                
                <button class="w3-btn w3-blue" onclick="addIngredientToShoppingList(this, ${ingredient.id});">Add Ingredient</button>

            `;
            div.appendChild(item);
        }
}

let addIngredientToShoppingList = async (elem, id) => {
    let par = elem.parentElement;
    let amount = par.getElementsByTagName('input')[0].value;
    let shoppingList = par.getElementsByTagName('select')[1].value;
    let unit = par.getElementsByTagName('select')[0].value;

    let response = await fetch('/addIngredientToShoppingList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: amount,
            unit: unit,
            shoppingList: shoppingList,
            ingredient_id: id
        })
    });

    await showShoppingLists();
}

// Function to fetch and display all categories together
let fetchCategoriesAndItems = async (categoryName) => {
    try {
        let responseCategories = await fetch(`/getIngredientsByCategory/${categoryName}`);
        let items = await responseCategories.json();

        // Sort items alphabetically by name
        items = items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        await createIngredientCards(items);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Function to fetch and display all categories together
async function fetchAllCategoriesAndItems() {
    try {
        let responseAllCategories = await fetch('/getAllIngredients');
        let items = await responseAllCategories.json();

        // Sort items alphabetically by name
        items = items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        // Clear the itemField and append sorted/filtered items

        await createIngredientCards(items);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

let toggleSideMenu = () => {
    let sideMenu = document.getElementById("sideMenu");
    sideMenu.classList.toggle("show");
}

let createShoppingList = async (elem) => {
    let listName = elem.parentElement.getElementsByTagName('input')[0].value;
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
        await getAllIngredients();
    }
}

(showShoppingLists = async () => {
    let response = await fetch('/getShoppingLists');
    if(!response.ok) throw new Error('Response not ok');

    let shoppingLists = await response.json();

    let par = document.getElementById('shoppingLists');
    par.innerHTML = "";
    for(let i = 0; i < shoppingLists.length; i++) {
        let outerDiv = document.createElement('div');
        par.appendChild(outerDiv);


        let elem = document.createElement('li');
        elem.innerText = shoppingLists[i].name;
        elem.className = "shoppingListName";

        let div = document.createElement('div');
        div.className = "shoppingListItems";

        let shoppingListItems = await fetch(`/getshoppingListItems/${shoppingLists[i].id}`);
        if(!shoppingListItems.ok) throw new Error('Response not ok');
        let items = await shoppingListItems.json();


        let tmp = "";
        for(let o = 0; o < items.length; o++) {
            tmp += `<p style="${(items[o].purchased ? "text-decoration: line-through" : "")}"><i class="fa ${(items[o].purchased ? "fa-times" : "fa-check")}" aria-hidden="true" onclick="toggleIngredientPurchaseStatus(${items[o].id})"></i>${items[o].quantity} ${items[o].unit} ${items[o].name}</p>`;
        }
        div.innerHTML = tmp;
        outerDiv.appendChild(elem);
        outerDiv.appendChild(div);
    }
})();

let toggleIngredientPurchaseStatus = async (itemID) => {
    try {
        await fetch('/updateShoppingListItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shoppingListItemID: itemID
            })
        });

        await showShoppingLists();
    } catch (e) {
        console.error('Error setting ingredient as purchased: ', e);
    }
};