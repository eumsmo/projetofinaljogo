import Jogador from "../componentes/jogador.js"
import {Ataque} from "../componentes/grupo_ataque.js"
import Projetil from "../componentes/projetil.js";

export default class CenaJogo extends Phaser.Scene {
    constructor(){
        super({
            key: "CenaJogo"
        });

        window["jogo"] = this;
    }

    preload(){
        // Carregado na CenaCarregamento
    }

    create(){
        
        const pizzas = {
            _config:{
                tipo: "sequencial",
                fim_sequencia: "repetir",
                cond_termino: {
                    min_ataques: 5
                }
            },
            ataques: {
                pizza: { // controle de grupos
                    _config:{
                        tipo: "unico"
                    },
                    sprite: "pizza",
                    w: 64, h: 64,
                    x: cena => cena.w, y: 100,
                    vida: 5,
                    movimentos: [
                        {
                            nome: "senoide",
                            divisor: 40,
                            multiplicador: 20,
                            velocidadeX: -280
                        }
                    ]
                }
            },
            sequencia: ["pizza"]
        }


        const canvas_width = this.sys.canvas.width;
        const canvas_height = this.sys.canvas.height;
        const fundo = this.add.image(canvas_width / 2, canvas_height/2, "background-jogo");
        fundo.setScale(canvas_width / fundo.width);

        this.jogador = new Jogador(this);


        this.template_grupos = {};
        this.inimigos = this.physics.add.group();

        this.teclas = this.input.keyboard.createCursorKeys();


        let grupoCena = Ataque.parseInformation(this, pizzas);
        window["a"] = grupoCena;
        grupoCena.comecar();
    }

    cria_template_grupo(template){
        if(!(template in this.template_grupos))
            this.template_grupos[template] = this.physics.add.group({ classType: Projetil,runChildUpdate: true});
    }

    get_from_template_grupo(template, infos){
        if(!(template in this.template_grupos)) return;

        let obj = this.template_grupos[template].get(infos.x,infos.y,infos.sprite);
        if (obj){
            this.inimigos.add(obj);
            obj.aparecer(infos);
            return obj;
        }
        
    }

    update(){
        this.physics.add.overlap(this.inimigos, this.jogador.atirador.grupo, this.colisao, this.colidiuMesmo);
        this.physics.add.overlap(this.jogador.sprite, this.inimigos, ()=>this.colisaoJogador(), this.colidiuMesmo);


        this.jogador.inputTeclado(this.teclas);
    }

    colidiuMesmo(obj1,obj2){
        return obj1.active && obj2.active;
    }

    colisao(inimigo, tiro){
        inimigo.dano(tiro);
        tiro.destruir();
    }

    colisaoJogador(){
        this.jogador.dano();
    }
}