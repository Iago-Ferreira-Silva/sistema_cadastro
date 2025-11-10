// Factory para criar objetos Pessoa
export function Pessoa(nome, dataNascimento, telefone, email) {
    console.log('Criando uma nova pessoa:', { nome, dataNascimento, telefone, email });
    return {
        nome,
        dataNascimento,
        telefone,
        email,
    };
}