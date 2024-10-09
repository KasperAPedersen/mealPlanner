// Kasper & Mie
document.addEventListener("DOMContentLoaded", async () => {
    if(document.getElementById('alertInfo').innerText === "") {
        document.getElementById('alert').remove();
    }
});

let closeAlert = (elem) => {
    elem.parentElement.style.display = "none";
}

let closeModal = () => {
    document.getElementById('overlay').style.display = 'none';
    let modal = document.getElementById('modal');
    modal.style.display = 'none';
    modal.innerHTML = "";
}

let showLoginModal = () => {
    document.getElementById('overlay').style.display = 'block';
    let modal = document.getElementById('modal');
    modal.style.display = 'block';
    modal.className = "accountModal";
    modal.innerHTML = `
        <form action="/login" class="w3-container w3-card-4 w3-light-grey w3-margin" method="POST">
            <h2 class="w3-center">Login</h2>
            <i class="fa fa-times" onclick="closeModal();" aria-hidden="true"></i>
            
            <label class=""><b>Email address</b></label>
            <input class="w3-input w3-border" name="email" type="email" placeholder="">
            
            <label class=""><b>Password</b></label>
            <input class="w3-input w3-border" name="password" type="password" placeholder="">

            <button class="w3-button w3-block w3-section w3-blue w3-ripple w3-padding" type="submit">Login</button>

        </form>
    `;
}

let showRegisterModal = () => {
    document.getElementById('overlay').style.display = 'block';
    let modal = document.getElementById('modal');
    modal.style.display = 'block';
    modal.className = "accountModal";
    modal.innerHTML = `
        <form action="/register" class="w3-container w3-card-4 w3-light-grey w3-margin" method="POST">
            <h2 class="w3-center">Register</h2>
            <i class="fa fa-times" onclick="closeModal();" aria-hidden="true"></i>
            
            <label class=""><b>First name</b></label>
            <input class="w3-input w3-border" name="first_name" type="text" placeholder="">
            
            <label class=""><b>Last name</b></label>
            <input class="w3-input w3-border" name="last_name" type="text" placeholder="">
            
            <label class=""><b>Email address</b></label>
            <input class="w3-input w3-border" name="email" type="email" placeholder="">
            
            <label class=""><b>Password</b></label>
            <input class="w3-input w3-border" name="password" type="password" placeholder="">
            
            <label class=""><b>Confirm password</b></label>
            <input class="w3-input w3-border" name="confirm_password" type="password" placeholder="">
            
            <button class="w3-button w3-block w3-section w3-blue w3-ripple w3-padding" type="submit">Register</button>
        </form>
    `;
}