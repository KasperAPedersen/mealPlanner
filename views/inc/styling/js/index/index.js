// Kasper, Mie, Anya & Nicolai

// Event listener that triggers when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async () => {

    // Fetch and display all ingredients when the page loads
    await getAllIngredientsOrByCategory();

    // Remove the alert element if there are no alert messages
    if(document.getElementById('alertInfo').innerText === "") {
        document.getElementById('alert').remove();
    }
});

// Function to toggle the visibility of the dropdown menu
let toggleDropdown = (elem) => {
    let content = elem.parentElement.getElementsByTagName('div')[0];
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

// Function to get all ingredients or by category
let getAllIngredientsOrByCategory = async (categoryName = null) => {
    try {
        // Fetch ingredients from the server and create cards
        let url = categoryName ? `/getIngredientsByCategory/${categoryName}` : '/getAllIngredients';
        let response = await fetch(url);
        if (!response.ok) throw new Error('Response not ok');
        let ingredients = await response.json();

        // Sort items alphabetically by name
        ingredients = ingredients.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        // Create ingredient cards with sorted/filtered items
        await createIngredientCards(ingredients);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Function to create ingredient cards for the front-end
let createIngredientCards = async (ingredients) => {
    let div = document.getElementById('itemField');
    div.innerHTML = ""; // Clear previous content

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
            item.className = "item w3-card-4";

            item.innerHTML = `
                <img src="inc/images/tomat.png" alt="Alps">
                    <div class="w3-container w3-center">
                        <p>${ingredient.name}</p>
                        <input type="number" class="w3-input" placeholder="Mængde"/> 
                        <select name="option" class="w3-select">
                            <option hidden selected disabled>Unit</option>
                            ${units}
                        </select>
                        
                        <select name="option" class="w3-select">
                            <option hidden selected disabled>List</option>
                            ${shoppingLists}
                        </select>
                        
                        <button class="w3-btn w3-blue" onclick="addIngredientToShoppingList(this, ${ingredient.id});">Add Ingredient</button>
                    </div>
            `;
/*
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

            `;*/
            div.appendChild(item);
        }
}

// Function to add an ingredient to a selected shopping list
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

// Function to toggle the visibility of the side menu
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

// Function to display shopping lists
(showShoppingLists = async () => {
    let response = await fetch('/getShoppingLists');
    if(!response.ok) throw new Error('Response not ok');

    let shoppingLists = await response.json();

    let par = document.getElementById('shoppingLists');
    par.innerHTML = ""; // Clear previous content

    for(let i = 0; i < shoppingLists.length; i++) {
        let outerDiv = document.createElement('div');
        par.appendChild(outerDiv);


        let elem = document.createElement('li');
        elem.innerHTML = `
            <h3><i class="fa-solid fa-trash-can" onclick="deleteFromShoppingList(${shoppingLists[i].id})"></i> ${shoppingLists[i].name}</h3>
        `;
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

// Function to toggle the purchased status of a shopping list item
let toggleIngredientPurchaseStatus = async (itemID) => {
    try {
        // Update the item's purchase status
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