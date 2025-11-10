// main.js
import { Pessoa } from './factory.js';
import { salvarCadastro, listarCadastros, atualizarCadastro, deletarCadastro } from './storage.js';

let indiceEditando = null;

// Função para formatar a data no formato brasileiro (DD/MM/AAAA)
function formatarDataParaBR(dataISO) {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Função para exibir mensagens de sucesso ou erro
function mostrarMensagem(texto, tipo) {
    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.textContent = texto;

    if (tipo === 'sucesso') {
        mensagemDiv.style.backgroundColor = '#d4edda';
        mensagemDiv.style.color = '#155724';
        mensagemDiv.style.border = '1px solid #c3e6cb';
    } else {
        mensagemDiv.style.backgroundColor = '#f8d7da';
        mensagemDiv.style.color = '#721c24';
        mensagemDiv.style.border = '1px solid #f5c6cb';
    }

    mensagemDiv.style.display = 'block';
    setTimeout(() => {
        mensagemDiv.style.display = 'none';
    }, 3000);
}

// Função para atualizar a lista de cadastros
function atualizarLista() {
    const lista = document.getElementById('listaCadastros');
    lista.innerHTML = '';

    const cadastros = listarCadastros();
    cadastros.forEach((pessoa, index) => {
        const item = document.createElement('li');
        item.classList.add('item-cadastro');

        const dataFormatada = formatarDataParaBR(pessoa.dataNascimento);
        item.innerHTML = `
            <p><strong>Nome:</strong> ${pessoa.nome}</p>
            <p><strong>Data de Nascimento:</strong> ${dataFormatada}</p>
            <p><strong>Telefone:</strong> ${pessoa.telefone}</p>
            <p><strong>Email:</strong> ${pessoa.email}</p>
        `;

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.classList.add('btn-excluir');
        btnExcluir.onclick = () => {
            deletarCadastro(index);
            mostrarMensagem('✅ Cadastro excluído com sucesso!', 'sucesso');
            atualizarLista();
        };

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.classList.add('btn-editar');
        btnEditar.onclick = () => carregarCadastroParaEdicao(index);

        item.appendChild(btnExcluir);
        item.appendChild(btnEditar);
        lista.appendChild(item);
    });
}

// Função para carregar os dados de um cadastro para edição
function carregarCadastroParaEdicao(index) {
    const cadastros = listarCadastros();
    const pessoa = cadastros[index];
    if (!pessoa) return;

    document.getElementById('nome').value = pessoa.nome;
    document.getElementById('dataNascimento').value = pessoa.dataNascimento;
    document.getElementById('telefone').value = pessoa.telefone;
    document.getElementById('email').value = pessoa.email;

    indiceEditando = index;
    document.querySelector('button[type="submit"]').textContent = 'Atualizar Cadastro';
}


// Evento de submit do formulário
document.getElementById('cadastroForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const dataNascimento = document.getElementById('dataNascimento').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!nome || !dataNascimento || !telefone || !email) {
        mostrarMensagem('⚠️ Todos os campos são obrigatórios.', 'erro');
        return;
    }

    const data = new Date(dataNascimento);
    const hoje = new Date();
    if (isNaN(data.getTime()) || data > hoje) {
        mostrarMensagem('⚠️ Data de nascimento inválida.', 'erro');
        return;
    }

    if (telefone.replace(/\D/g, '').length !== 11) {
        mostrarMensagem('⚠️ Telefone inválido.', 'erro');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarMensagem('⚠️ Email inválido.', 'erro');
        return;
    }

    const novaPessoa = Pessoa(nome, dataNascimento, telefone, email);

    if (indiceEditando !== null) {
        atualizarCadastro(indiceEditando, novaPessoa);
        mostrarMensagem('✅ Cadastro atualizado com sucesso!', 'sucesso');
        indiceEditando = null;
        document.querySelector('button[type="submit"]').textContent = 'Salvar Cadastro';
    } else {
        salvarCadastro(novaPessoa);
        mostrarMensagem('✅ Cadastro salvo com sucesso!', 'sucesso');
    }

    atualizarLista();
    this.reset();
});

// Formatação do campo de telefone
document.getElementById('telefone').addEventListener('input', function () {
    let numero = this.value.replace(/\D/g, '');
    if (numero.length > 11) numero = numero.slice(0, 11);

    let formatado = '';
    if (numero.length > 0) formatado += '(' + numero.slice(0, 2);
    if (numero.length >= 3) formatado += ')' + numero.slice(2, 7);
    if (numero.length >= 8) formatado += '-' + numero.slice(7);
    this.value = formatado;
});

document.addEventListener('DOMContentLoaded', atualizarLista);