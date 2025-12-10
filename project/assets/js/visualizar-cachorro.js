// ===========================================================
// PEGAR ID DO CACHORRO PELA URL
// ===========================================================
const params = new URLSearchParams(window.location.search);
const idCao = params.get("id");

// ===========================================================
// PEGAR ID DO USUÁRIO DO CACHE (localStorage)
// ===========================================================
function getUsuarioLogado() {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) return null;

    try {
        return JSON.parse(usuario);
    } catch {
        return null;
    }
}

// ===========================================================
// CARREGAR CACHORRO
// ===========================================================
async function carregarCachorro() {
    try {
        const req = await fetch(`http://localhost/apicaes/api.php?url=api/caes/${idCao}`);
        const resposta = await req.json();

        if (resposta.erro || !resposta.dados) {
            alert("Cachorro não encontrado!");
            return;
        }

        const cao = resposta.dados;

        // Preenche infos
        document.getElementById("nome").textContent = cao.nome;
        document.getElementById("sexo").textContent =
            cao.sexo === "M" ? "Macho" :
                cao.sexo === "F" ? "Fêmea" : "Não informado";

        document.getElementById("porte").textContent = cao.porte;
        document.getElementById("descricao").textContent = cao.descricao;

        carregarFotos(cao.fotos);
        configurarModal();

        // Botão ADOTAR
        document.getElementById("btnAdotar").addEventListener("click", () => registrarAdocao(cao));

    } catch (e) {
        console.error("Erro:", e);
        alert("Erro ao carregar cachorro.");
    }
}

carregarCachorro();


// ===========================================================
// REGISTRAR ADOÇÃO
// ===========================================================
async function registrarAdocao(cao) {
    const usuario = getUsuarioLogado();

    if (!usuario) {
        alert("Você precisa estar logado para adotar!");
        return;
    }

    const dados = {
        id_usuario: usuario.id,
        id_cao: cao.id,
        data_adocao: new Date().toISOString().split("T")[0],
        descricao: `Adoção do cão ${cao.nome}`
    };

    try {
        const req = await fetch("http://localhost/apicaes/api.php?url=api/adocoes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const resposta = await req.json();

        if (resposta.erro) {
            alert(resposta.mensagem || "Erro ao registrar adoção.");
            return;
        }

        alert("Adoção registrada com sucesso!");
        console.log(resposta);

    } catch (e) {
        console.error("Erro ao registrar adoção:", e);
        alert("Erro ao registrar adoção.");
    }
}


// ===========================================================
// FOTOS
// ===========================================================
function carregarFotos(fotos) {
    for (let i = 1; i <= 5; i++) {
        const img = document.getElementById(`photo-${i}`);
        const col = img.parentElement;

        if (!fotos[i - 1]) {
            col.classList.add("hidden-photo-col");
        } else {
            col.classList.remove("hidden-photo-col");
            img.src = fotos[i - 1];
        }
    }
}

// ===========================================================
// MODAL
// ===========================================================
let imagens = [];
let indiceAtual = 0;

function configurarModal() {
    imagens = [];

    const todas = document.querySelectorAll(".foto-cachorro");

    todas.forEach(img => {
        if (img.src && img.src.trim() !== "") {
            imagens.push(img.src);

            img.addEventListener("click", () => {
                abrirModal(imagens.indexOf(img.src));
            });
        }
    });
}

function abrirModal(index) {
    indiceAtual = index;

    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");

    modal.style.display = "flex";
    modalImage.src = imagens[indiceAtual];
}

function fecharModal() {
    document.getElementById("imageModal").style.display = "none";
}

function anterior() {
    indiceAtual = (indiceAtual - 1 + imagens.length) % imagens.length;
    document.getElementById("modalImage").src = imagens[indiceAtual];
}

function proxima() {
    indiceAtual = (indiceAtual + 1) % imagens.length;
    document.getElementById("modalImage").src = imagens[indiceAtual];
}

document.querySelector(".close-modal").addEventListener("click", fecharModal);
document.querySelector(".left-arrow").addEventListener("click", anterior);
document.querySelector(".right-arrow").addEventListener("click", proxima);

document.getElementById("imageModal").addEventListener("click", (e) => {
    if (e.target.id === "imageModal") fecharModal();
});
