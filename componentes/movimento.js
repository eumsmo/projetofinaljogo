import {gerenciadorCadastramento} from "./util.js"

export const Movimentos = gerenciadorCadastramento();

const exemploMovimento = {
    variaveis: {},
    create(sprite, is_constructor){
        // Chamada na criação de um sprite ou na hora que ele reaparece (no caso na reutilização de sprites)
        // is_constructor é um booleano que diz se a chamada do create foi no constructor ou não 
    },
    update(sprite){
        // Chamada em todo update do sprite
    }
};


const senoideLinearParaEsquerda = {
    variaveis: {},
    create(sprite){
        sprite.y_base = sprite.y;
    },
    update(sprite){
        const variaveis = this.variaveis;
        let velocidadeX = variaveis.velocidadeX || -280,
            divisor = variaveis.divisor || 40,
            multiplicador = variaveis.multiplicador || 20;

        sprite.setVelocityX(velocidadeX);
        sprite.y = sprite.y_base + Math.cos(sprite.x / divisor) * multiplicador;
    }
}

Movimentos.cadastrar("senoide", senoideLinearParaEsquerda);