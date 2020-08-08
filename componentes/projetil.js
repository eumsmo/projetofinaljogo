import {Movimentos} from "./movimento.js"


export default class Projetil extends Phaser.Physics.Arcade.Image {

    static parseValoresDinamicos(cena_tam, { x, y, w, h } = {}) {
        const pre_functions = {
            largura_tela(tela){return tela.w},
            altura_tela(tela){return tela.h},
        };

        [x,y,w,h] = [x,y,w,h].map(val=>{
            if (val instanceof Function) return val(cena_tam);
            else if(val in pre_functions) return pre_functions[val](cena_tam);
            return val;
        });

        return { x, y, w, h }
    }

    constructor(cena, x, y, template, info = null ) {

        const cena_tam = {
            w: cena.cameras.main.width,
            h: cena.cameras.main.height
        };

        let parsed = Projetil.parseValoresDinamicos(cena_tam, { x, y});
        let tx = parsed.x;
        let ty = parsed.y;

        super(cena, tx, ty, template);

        this.cena = cena;
        this.cena_tam = cena_tam;

        if(info){
            info = Object.assign({x,y}, info);
            this._create(info);
        }
    }

    _create({ x, y,  w, h, vida, movimentos } ){
        if (w && !h) h = w;
        else if (h && !w) w = h;

        let parsed = Projetil.parseValoresDinamicos(this.cena_tam, {x,y,w,h});
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

        this.tamanho = sprite_tam;

        if (w || h) {
            const scale = Math.max(sprite_tam.w / this.width, sprite_tam.h / this.height);
            this.setScale(scale);
        }

        if (vida) {
            this.vida_base = vida;
            this.vida = vida;
        }

        this.movimentos = [];
        if (movimentos) {
            for(let movimento of movimentos){
                
                let movimento_obj = ("nome" in movimento) ? Movimentos.pegar(movimento.nome) : movimento;
                movimento_obj.variaveis = movimento;


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
        return this.x < -this.tamanho.w / 2;
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
