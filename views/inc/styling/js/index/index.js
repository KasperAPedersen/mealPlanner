let showLoginModal = () => {
    let modal = document.getElementById('modal');
    console.log(123);
    modal.style.display = 'block';
    modal.className = "accountModal";
    modal.innerHTML = `
        <form action="/login" class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin" method="POST">
            <h2 class="w3-center">Login</h2>

            <div class="w3-row w3-section">
              <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-user"></i></div>
                <div class="w3-rest">
                  <input class="w3-input w3-border" name="name" type="text" placeholder="Username or Email">
                </div>
            </div>

            <div class="w3-row w3-section">
              <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-key"></i></div>
                <div class="w3-rest">
                  <input class="w3-input w3-border" name="password" type="password" placeholder="Password">
                </div>
            </div>

            <button class="w3-button w3-block w3-section w3-blue w3-ripple w3-padding" type="submit">Login</button>

        </form>
    `;
}