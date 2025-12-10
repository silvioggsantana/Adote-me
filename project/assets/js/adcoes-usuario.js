// ------------------------------
// PEGAR USUÁRIO LOGADO DO CACHE
// ------------------------------
function getUsuarioLogado() {
    const cache = localStorage.getItem("usuario");
    if (!cache) return null;
    try {
        return JSON.parse(cache);
    } catch {
        return null;
    }
}

// ------------------------------------
// BUSCAR TODOS OS REGISTROS DE ADOÇÃO
// ------------------------------------
async function carregarAdocoesDoUsuario(idUsuario) {
    try {
        const req = await fetch("http://localhost/apicaes/api.php?url=api/adocoes");
        const res = await req.json();

        if (res.erro || !res.dados) return [];

        // filtra apenas adoções do usuário logado
        return res.dados.filter(adocao => adocao.id_usuario == idUsuario);

    } catch (e) {
        console.error("Erro ao buscar adoções:", e);
        return [];
    }
}

// ------------------------------
// BUSCAR UM CACHORRO PELO ID
// ------------------------------
async function carregarCachorro(idCao) {
    try {
        const req = await fetch(`http://localhost/apicaes/api.php?url=api/caes/${idCao}`);
        const res = await req.json();

        if (res.erro) return null;
        return res.dados;

    } catch (e) {
        console.error("Erro ao carregar cachorro:", e);
        return null;
    }
}

// ------------------------------
// BUSCAR USUÁRIO PELO ID
// ------------------------------
async function carregarUsuario(idUsuario) {
    try {
        const req = await fetch(`http://localhost/apicaes/api.php?url=api/usuarios/${idUsuario}`);
        const res = await req.json();

        if (res.erro) return null;
        return res.dados;

    } catch (e) {
        console.error("Erro ao carregar usuário:", e);
        return null;
    }
}

// ------------------------------
// MONTA O CARD NA TELA
// ------------------------------
function montarCard(adocao, cachorro, usuario) {

    return `
        <div class="interessado-card">
            <div class="interessado-info">
                <h3>${cachorro?.nome || "Cão desconhecido"}</h3>
                <p>${adocao.descricao}</p>
                <p><strong>Data da adoção:</strong> ${adocao.data_adocao}</p>
            </div>

            <div class="interessado-contato">
                <p><strong>Adotado por:</strong> ${usuario?.nome || "Usuário desconhecido"}</p>
                <p><strong>Email:</strong> ${usuario?.email || "-"}</p>
            </div>
        </div>
    `;
}

// ------------------------------
// CARREGAR LISTA COMPLETA
// ------------------------------
async function carregarListaFinal() {
    const container = document.querySelector("#lista-interessados");
    container.innerHTML = "<p>Carregando...</p>";

    const usuarioLogado = getUsuarioLogado();
    if (!usuarioLogado) {
        container.innerHTML = "<p style='color:red'>Usuário não está logado.</p>";
        return;
    }

    const adocoes = await carregarAdocoesDoUsuario(usuarioLogado.id);

    if (adocoes.length === 0) {
        container.innerHTML = "<p>Você ainda não adotou nenhum cachorro.</p>";
        return;
    }

    container.innerHTML = ""; // limpa

    for (const adocao of adocoes) {

        // busca individual
        const cachorro = await carregarCachorro(adocao.id_cao);
        const usuario = await carregarUsuario(adocao.id_usuario);

        // monta e adiciona
        container.innerHTML += montarCard(adocao, cachorro, usuario);
    }
}

carregarListaFinal();
