// Kasper
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