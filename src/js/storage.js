// Salva uma nova pessoa no localStorage
export function salvarCadastro(pessoa) {
    const cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    cadastros.push(pessoa);
    localStorage.setItem('cadastros', JSON.stringify(cadastros));
}

// Lista todos os cadastros armazenados no localStorage
export function listarCadastros() {
    return JSON.parse(localStorage.getItem('cadastros')) || [];
}


// Atualiza um cadastro existente no localStorage
export function atualizarCadastro(index, novaPessoa) {
    const cadastros = listarCadastros();
    cadastros[index] = novaPessoa;
    localStorage.setItem('cadastros', JSON.stringify(cadastros));
}


// Deleta um cadastro pelo índice no localStorage
export function deletarCadastro(index) {
    const cadastros = listarCadastros();
    const removido = cadastros.splice(index, 1);
    localStorage.setItem('cadastros', JSON.stringify(cadastros));
    return removido;
}