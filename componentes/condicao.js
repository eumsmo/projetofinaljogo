import { gerenciadorCadastramento } from "./util.js"

const Condicoes = gerenciadorCadastramento();
export default Condicoes;

const exemploCondicao = {
    create(){},
    promesa(contexto){
        return new Promise(function(){})
    },
    checar(contexto){
        return true || false;
    }
};

Condicoes.cadastrar("template", exemploCondicao);


// Condições de termino do ataque
// Contexto: o proprio ataque

const min_ataque = {
    checar(contexto) {
        const ataque = contexto;
        return ataque.quant_ataques_feitos >= this.variaveis.value;
    }
};

Condicoes.cadastrar("min_ataques", min_ataque);

const min_pontos = {
    checar(contexto) {
        const ataque = contexto;
        const cena = ataque.cena;

        return false; // TO DO: adicionar sistema de pontos
    }
};

Condicoes.cadastrar("min_pontos", min_pontos);

const min_tempo = {
    tempo_inicial: null,
    create(contexto){
        this.tempo_inicial = Date.now();
    },
    checar(){
        return (Date.now() - this.tempo_inicial) >= this.variaveis.value;
    },
    promesa(contexto){
        
    }
};

Condicoes.cadastrar("min_tempos", min_tempo);