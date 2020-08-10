import {Movimentos} from "./movimento.js"
import ValoresDinamicos from "./valores_dinamicos.js";


export default class Projetil extends Phaser.Physics.Arcade.Image {

    parseValoresDinamicos(valores_obj) {
        let novo_obj = {};

        for(let chave in valores_obj){
            let val = valores_obj[chave];
            if (val instanceof Function) novo_obj[chave] = val(this, valores_obj);
            else if (ValoresDinamicos.contem(val)) novo_obj[chave] = ValoresDinamicos.pegar(val).func(this, valores_obj);
            else novo_obj[chave]=val;
        }   

        return novo_obj;
    }

    constructor(cena, x, y, template, info = null ) {

        const cena_tam = {
            w: cena.cameras.main.width,
            h: cena.cameras.main.height
        };

        

        super(cena, 0, 0, template);

        this.cena = cena;
        this.cena_tam = cena_tam;

        let parsed = this.parseValoresDinamicos({ x, y });
        this.x = parsed.x;
        this.y = parsed.y;

        if(info){
            info = Object.assign({x,y}, info);
            this._create(info);
        }
    }

    get tamanho(){
        return { w: this.displayWidth, h: this.displayHeight}
    }

    _create({ x, y,  w, h, vida, movimentos, foraDaTela } ){
        if (w && !h) h = w;
        else if (h && !w) w = h;

        let parsed = this.parseValoresDinamicos({x,y,w,h});
        x = parsed.x;
        y = parsed.y;
        w = parsed.w;
        h = parsed.h;

        const sprite_tam = { w, h };

        // Temporario (?)
        this._base = {
            x, y, 
        };

        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.angle = 0;
        this.alpha = 1;

        if (w || h) {
            const scale = Math.max(sprite_tam.w / this.width, sprite_tam.h / this.height);
            this.setScale(scale);
        }


        
        const fora_tela_direcoes = {
            esquerda: sprite => sprite.x < -sprite.tamanho.w / 2,
            direita: sprite => sprite.x > sprite.cena_tam.w + sprite.tamanho.w / 2,
            cima: sprite => sprite.y < -sprite.tamanho.h/2,
            baixo: sprite => sprite.y > sprite.cena_tam.h + sprite.tamanho.h / 2
        }

        if(foraDaTela){
            if(foraDaTela == "todas") foraDaTela = Object.keys(fora_tela_direcoes);

            let condicoes = foraDaTela instanceof Array? foraDaTela : [foraDaTela];
            this.foraDaTelaCondicoes = condicoes.map(key=> fora_tela_direcoes[key]);
        } else {
            this.foraDaTelaCondicoes = [fora_tela_direcoes.esquerda];
        }

        if (vida) {
            this.vida_base = vida;
            this.vida = vida;
        }

        this.movimentos = [];
        if (movimentos) {
            for(let movimento of movimentos){
                
                let movimento_obj = ("nome" in movimento) ? Movimentos.pegar(movimento.nome, movimento) : movimento;


                if ("create" in movimento_obj)
                    movimento_obj.create.bind(movimento_obj)(this, true);

                this.movimentos.push(movimento_obj);
            }
        }
    }

    dano(tiro) {
        if(!this.vida)
            this.destruir();

        let dano = tiro.dano;
        this.vida -= dano;

        if (this.vida <= 0)
            this.destruir();
    }

    foraDaTela() {
        for (let condicao of this.foraDaTelaCondicoes){
            if(condicao(this)) return true;
        }
        return false;
    }

    update() {
        for(let movimento of this.movimentos){
            if ("update" in movimento)
                movimento.update.bind(movimento)(this);
        }
        

        if (this.foraDaTela())
            this.destruir();
    }

    static APARECER_EVENT = "aparecer";
    static DESTRUIR_EVENT = "destruir";

    aparecer(obj) {
        if(obj){
            this._create(obj);
        }
        this.enableBody(true, this.x, this.y, true, true);
        this.emit(Projetil.APARECER_EVENT, this);
    }

    destruir(){
        this.disableBody(true, true);
        this.setActive(false);

        this.emit(Projetil.DESTRUIR_EVENT, this);
    }

    static gerar(cena, prop){
        let projetil = new Projetil(cena, prop.x, prop.y, prop.template, prop);
        return projetil;
    }

    static gerarGerador(prop){
        return cena => this.gerar(cena, prop);
    }
}
