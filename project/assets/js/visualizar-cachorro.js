// Pega o ID via query string
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Buscar dados do cachorro
fetch("../assets/data/cachorros.json")
    .then(res => res.json())
    .then(lista => {

        const cachorro = lista.find(item => item.id == id);

        if (!cachorro) {
            alert("Cachorro não encontrado!");
            return;
        }

        // Atualiza grid de fotos (AGORA COM CAMINHO COMPLETO)
        atualizarGridDeFotos(cachorro);

        // Preencher infos
        document.querySelector(".sexo-porte-group:nth-child(1) .valor-campo").textContent = cachorro.sexo;
        document.querySelector(".sexo-porte-group:nth-child(2) .valor-campo").textContent = cachorro.porte;
        document.querySelector(".form-label strong").nextSibling.textContent = " " + cachorro.nome;

        // Preencher descrição
        document.querySelector(".descricao-box").textContent = cachorro.descricao;

        // Prepara modal apenas com fotos existentes
        prepararModal();

        // BOTÃO DE ADOTAR
        const botaoAdotar = document.getElementById("btnAdotar");

        botaoAdotar.addEventListener("click", () => {
            if (!cachorro.emailDono) {
                alert("Este anunciante não deixou um e-mail para contato.");
                return;
            }

            window.location.href = `mailto:${cachorro.emailDono}?subject=Quero%20adotar%20o%20${cachorro.nome}`;
        });
    });


// ------------------- MODAL DE IMAGENS -------------------
let imagensDoCachorro = [];
let indiceAtual = 0;

function prepararModal() {
    imagensDoCachorro = [];

    const imgs = document.querySelectorAll(".foto-cachorro");

    imgs.forEach((img) => {
        const src = img.src;

        if (!src || src.trim() === "") return; // ignora imagens vazias

        imagensDoCachorro.push(src);

        img.addEventListener("click", () => {
            abrirModal(imagensDoCachorro.indexOf(src));
        });
    });
}

function abrirModal(index) {
    indiceAtual = index;
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");

    modal.style.display = "flex";
    modalImg.src = imagensDoCachorro[indiceAtual];
}

function fecharModal() {
    document.getElementById("imageModal").style.display = "none";
}

function imagemAnterior() {
    indiceAtual = (indiceAtual - 1 + imagensDoCachorro.length) % imagensDoCachorro.length;
    document.getElementById("modalImage").src = imagensDoCachorro[indiceAtual];
}

function proximaImagem() {
    indiceAtual = (indiceAtual + 1) % imagensDoCachorro.length;
    document.getElementById("modalImage").src = imagensDoCachorro[indiceAtual];
}

document.querySelector(".close-modal").addEventListener("click", fecharModal);
document.querySelector(".left-arrow").addEventListener("click", imagemAnterior);
document.querySelector(".right-arrow").addEventListener("click", proximaImagem);

document.getElementById("imageModal").addEventListener("click", (e) => {
    if (e.target.id === "imageModal") {
        fecharModal();
    }
});


// --------------------------------------------------------------
// ESCONDER CARDS SEM IMAGEM (CORRIGIDO E INCLUINDO PASTA)
// --------------------------------------------------------------
function atualizarGridDeFotos(cachorro) {

    for (let i = 1; i <= 5; i++) {
        const card = document.getElementById(`photo-${i}`);
        const coluna = card.parentElement;

        if (!cachorro.fotos[i - 1]) {
            coluna.style.display = "none";
        } else {
            coluna.style.display = "";
            card.src = `../assets/imgs/${cachorro.pasta}/${cachorro.fotos[i - 1]}`;
        }
    }
}
