// Kasper & Mie
document.addEventListener("DOMContentLoaded", async () => {
    if(document.getElementById('alertInfo').innerText === "") {
        document.getElementById('alert').remove();
    }
});

let toggleDropdown = (elem) => {
    let content = elem.parentElement.getElementsByTagName('div')[0];
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

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