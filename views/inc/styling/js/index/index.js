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

let getAllIngredients = async () => {
    try {
        let div = document.getElementById('itemField');
        div.innerHTML = "";

        let response = await fetch('/getAllIngredients');
        if (!response.ok) throw new Error('Response not ok');

        let ingredients = await response.json();

        for(let i = 0; i < ingredients.length; i++) {
            let ingredient = ingredients[i];
            let item = document.createElement('div');
            item.className = "item";
            item.innerHTML = `
                <h1>${ingredient.name}</h1>
            `;
            div.appendChild(item);
        }
    } catch (e) {
        console.error('Fetch problem: ', e);
    }
}

// ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###
/*
function FilterItems() {
    let itemField = document.getElementById('itemField');
    let items = Array.from(itemField.getElementsByClassName('item'));
    let filterOption = document.getElementById('filterOptions').value.toLowerCase();

    items.forEach(item => {
        let category = item.getAttribute('data-category').toLowerCase();
        if (category === filterOption || filterOption === 'all') {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });

    // Sort items alphabetically by name
    items = items.sort((a, b) => {
        let nameA = a.querySelector('h1').innerText.toLowerCase();
        let nameB = b.querySelector('h1').innerText.toLowerCase();
        return nameA.localeCompare(nameB);
    });

    // Clear the itemField and append sorted/filtered items
    itemField.innerHTML = '';
    items.forEach(item => itemField.appendChild(item));
}*/

// ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###

// Function to fetch categories and items

let fetchCategoriesAndItems = async (categoryName) => {
    try {
        let responseCategories = await fetch(`/getIngredientsByCategory/${categoryName}`);
        let items = await responseCategories.json();

        // Sort items alphabetically by name
        items = items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        let par = document.getElementById('itemField');
        par.innerHTML = "";
        for(let i = 0; i < items.length; i++) {
            let elem = document.createElement('div');
            elem.className = 'item';
            elem.innerHTML = `
                <h1>${items[i].name}</h1>
            `;
            par.appendChild(elem);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};


// ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###

// Filtering, sorting, and fetching combined into a single function
/*async function FilterItems() {
    try {
        // Fetch categories and items from the server
        let responseCategories = await fetch('/getCategories');
        if (!responseCategories.ok) throw new Error('Response not ok for categories');
        let categories = await responseCategories.json();

        let responseItems = await fetch('/getAllIngredients');
        if (!responseItems.ok) throw new Error('Response not ok for items');
        let items = await responseItems.json();

        // Sort items alphabetically by name
        items = items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        // Get the selected filter option (category) from the dropdown
        let filterOption = document.getElementById('filterOptions').value.toLowerCase();

        // Get the itemField and clear it before adding items
        let itemField = document.getElementById('itemField');
        itemField.innerHTML = ''; // Clear the item field

        // Filter and display items based on the selected category
        items.forEach(itemData => {
            let category = itemData.category.toLowerCase();
            if (category === filterOption || filterOption === 'all') {
                // Create and append each filtered item to the DOM
                let itemElement = document.createElement('div');
                itemElement.classList.add('item');
                itemElement.setAttribute('data-category', itemData.category.toLowerCase());

                // Add item content (e.g., name inside an h1)
                itemElement.innerHTML = `<h1>${itemData.name}</h1>`;
                itemField.appendChild(itemElement);
            }
        });

        // Sort items alphabetically within the displayed set
        let displayedItems = Array.from(itemField.getElementsByClassName('item'));
        displayedItems = displayedItems.sort((a, b) => {
            let nameA = a.querySelector('h1').innerText.toLowerCase();
            let nameB = b.querySelector('h1').innerText.toLowerCase();
            return nameA.localeCompare(nameB);
        });

        // Clear the itemField and append sorted/filtered items
        itemField.innerHTML = '';
        displayedItems.forEach(item => itemField.appendChild(item));

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}*/

// Event listener to trigger filtering when the filter options change
//document.getElementById('filterOptions').addEventListener('change', FilterItems);

// Trigger filtering and fetching when the page loads
//window.onload = FilterItems;


let toggleSideMenu = () => {
    let sideMenu = document.getElementById("sideMenu");
    if (sideMenu.style.width === "250px") {
        sideMenu.style.width = "0";
    } else {
        sideMenu.style.width = "250px";
    }
}

let createShoppingList = () => {
    let listName = prompt("Enter the name of the new shopping list:");
    if (listName) {
        let shoppingLists = document.getElementById("shoppingLists");
        let listItem = document.createElement("li");
        listItem.textContent = listName;
        shoppingLists.appendChild(listItem);
    }
}