import { gerenciadorCadastramento } from "./util.js"

const ValoresDinamicos = gerenciadorCadastramento();
export default ValoresDinamicos;

const exemploValor = function(){
    return "valor";
}

ValoresDinamicos.cadastrar("exemplo", {func: exemploValor});
ValoresDinamicos.cadastrar("largura_tela", { func: (sprite, vals) => sprite.cena_tam.w});
ValoresDinamicos.cadastrar("altura_tela", { func: (sprite, vals) => sprite.cena_tam.h});
