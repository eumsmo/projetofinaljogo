import { gerenciadorCadastramento } from "./util.js"
import Projetil from "./projetil.js"
import ValoresDinamicos from "./valores_dinamicos.js"

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
        let velocidadeX = variaveis.velocidadeX || -420,
            divisor = variaveis.divisor || 60,
            multiplicador = variaveis.multiplicador || 30;

        sprite.setVelocityX(velocidadeX);
        sprite.y = sprite.y_base + Math.cos(sprite.x / divisor) * multiplicador;
    }
}

Movimentos.cadastrar("senoide", senoideLinearParaEsquerda);


const simples = {
    variaveis: {},
    update(sprite) {
        const variaveis = this.variaveis;
        let velocidadeX = variaveis.velocidadeX || 0,
            velocidadeY = variaveis.velocidadeY || 0;

        sprite.setVelocityX(velocidadeX);
        sprite.setVelocityY(velocidadeY);
    }
}

Movimentos.cadastrar("simples", simples);


// Arquivo separado para essa seção

let cache = null;

const salvar = {
    variaveis: {},
    create(sprite) {
        sprite.on(Projetil.DESTRUIR_EVENT, ()=>this.salvar_sprite(sprite));
    },
    salvar_sprite(sprite){
        cache = sprite;
    }
}

Movimentos.cadastrar("projetil-cache-ondeath", salvar);
Movimentos.cadastrar("angle-cache", {create(sprite){sprite.angle=cache? cache.angle : 0}});

ValoresDinamicos.cadastrar("x-cache", {func: () => cache ? cache.x : 0});
ValoresDinamicos.cadastrar("y-cache", {func: () => cache ? cache.y : 0});



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

const rodando = {
    create(sprite){
        const variaveis = this.variaveis;
        const anguloInicial = variaveis.anguloInicial || 0;
        sprite.angle=anguloInicial;
    },
    update(sprite){
        const variaveis = this.variaveis;
        const velocidade = variaveis.velocidade != undefined ? variaveis.velocidade : -1;
        sprite.angle+=velocidade;
    }
}

Movimentos.cadastrar("rodando", rodando);

const gota = {
    create(sprite) {
        sprite.alpha = 0.8;
    }
}

Movimentos.cadastrar("gota", gota);