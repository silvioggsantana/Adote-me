document.addEventListener("DOMContentLoaded", async () => {
    const cardsHome = document.getElementById("cards-home");

    try {
        const response = await fetch("../assets/data/cachorros.json");
        const dogs = await response.json();

        const primeiros4 = dogs.slice(0, 4);

        primeiros4.forEach(dog => {
            const card = document.createElement("div");
            card.classList.add("col-md-3");

            // monta o caminho da imagem de forma resiliente:
            // - se dog.pasta existir (ex: "odie") usa ../assets/imgs/<pasta>/<arquivo>
            // - caso contrário usa dog.nome sanitizado (sem espaços/acentos) como nome da pasta
            const sanitize = (str) => {
                if (!str) return "";
                return str
                    .normalize('NFD')             // separa acentos
                    .replace(/[\u0300-\u036f]/g, '') // remove acentos
                    .replace(/\s+/g, '')         // remove espaços
                    .toLowerCase();
            };

            const pasta = dog.pasta ? dog.pasta : sanitize(dog.nome);
            const primeiraFoto = Array.isArray(dog.fotos) && dog.fotos.length ? dog.fotos[0] : 'foto1.jpg';
            const imgPath = `../assets/imgs/${pasta}/${primeiraFoto}`;

            card.innerHTML = `
                <div class="card card-dog">
                    <img src="${imgPath}" class="card-img-top" alt="${dog.nome}">
                    <div class="card-body">
                        <div class="text-container">
                            <p class="card-text">${dog.descricao}</p>
                        </div>
                        <a href="visualizar-cachorro.html?id=${dog.id}" class="btn-adotar">ADOTAR</a>
                    </div>
                </div>
            `;

            cardsHome.appendChild(card);
        });

    } catch (error) {
        console.error("Erro ao carregar os cards na home:", error);
    }
});
