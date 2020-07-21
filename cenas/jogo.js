import Pizza from "../componentes/pizza.js"
import Jogador from "../componentes/jogador.js"

export default class CenaJogo extends Phaser.Scene {
    constructor(){
        super({
            key: "CenaJogo"
        });
    }

    preload(){
        // Carregado na CenaCarregamento
    }

    create(){
        const canvas_width = this.sys.canvas.width;
        const canvas_height = this.sys.canvas.height;
        const fundo = this.add.image(canvas_width / 2, canvas_height/2, "background-jogo");
        fundo.setScale(canvas_width / fundo.width);

        this.jogador = new Jogador(this);

        this.pizzas = this.physics.add.group({ classType: Pizza, maxSize: 5, runChildUpdate: true})
        this.pizzas.get();

        this.inimigos = this.physics.add.group();

        this.teclas = this.input.keyboard.createCursorKeys();
    }

    update(){

        if (this.pizzas.countActive() === 0){
            let pizza = this.pizzas.get();
            if(pizza){
                this.inimigos.add(pizza);
                pizza.aparecer(192);
            }
        }

        this.physics.add.collider(this.inimigos, this.jogador.atirador.grupo, this.colisao, this.colidiuMesmo);
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