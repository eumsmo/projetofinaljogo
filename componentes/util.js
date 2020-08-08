export function gerenciadorCadastramento() {
    const cadastros = {};

    return {
        cadastrar(nome, cadastro) {
            if (nome in cadastros) return false;
            if (typeof cadastro != "object") return false;
            cadastros[nome] = Object.assign({}, cadastro);
            return true;
        },
        pegar(nome, props={}) {
            if (!(nome in cadastros)) return null;
            else {
                let obj = Object.assign({}, cadastros[nome]);
                obj.variaveis = Object.assign(props, obj.variaveis);
                return obj;
            }
        },
        remover(nome) {
            if (!(nome in cadastros)) return null;
            let modelo = cadastros[nome];
            cadastros[nome] = undefined;
            return modelo;
        },
        atualizar(nome, cadastro) {
            if (typeof cadastro != "object") return false;
            cadastros[nome] = Object.assign({}, cadastro);
            return true;
        }
    };
}
