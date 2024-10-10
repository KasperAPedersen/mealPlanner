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

let toggleSideMenu = () => {
    let sideMenu = document.getElementById("sideMenu");
    sideMenu.classList.toggle("show");
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
