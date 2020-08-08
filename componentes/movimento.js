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


const praCima = {
    variaveis: {fase: 1},
    update(sprite) {
        const cena_tam = sprite.cena_tam;
        
        if(this.variaveis.fase==1){
            this.movimentoPraCima(sprite);
            if (sprite.y < cena_tam.h-50) this.variaveis.fase = 2;
        } else if (this.variaveis.fase == 2){
            this.movimentoPraBaixo(sprite);
            if (sprite.y > cena_tam.h + sprite.h) this.variaveis.fase = 1;
        }
    },
    movimentoPraCima(sprite){
        const velocidadeY = -480;
        sprite.setVelocityY(velocidadeY);
    },
    movimentoPraBaixo(sprite){
        const velocidadeY = 480;
        sprite.setVelocityY(velocidadeY);
    }
}

Movimentos.cadastrar("cima", praCima);