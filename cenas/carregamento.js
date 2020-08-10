export default class CenaCarregamento extends Phaser.Scene {
    // Essa cena irá pre carregar todas as coisas do jogo

    constructor() {
        super({
            key: "CenaCarregamento"
        });
    }

    preload() {
        this.load.on("complete", () => this.scene.start("CenaJogo") );

        this.load.image("background-jogo", "src/img/background.png");
        this.load.image("quadro-hp", "src/img/quadroHP.png");

        this.load.image("cadeira", "src/img/cadeira.png");
        this.load.image("atirando", "src/img/atirador1.png");
        this.load.image("atirando2", "src/img/atirando2.png");
        this.load.image("tiro", "src/img/tiro.png");

        this.load.image("garfo", "src/img/garfo.png");
        this.load.image("faca-cima", "src/img/faca-cima.png");
        this.load.image("faca-lado", "src/img/faca-lado.png");
        
        this.load.image("pizza", "src/img/pizza.png");

        this.load.image("vinho", "src/img/vinho.png");
        this.load.image("gota-vinho-baixo", "src/img/gota_vinho.png");
        this.load.image("gota-vinho-lado", "src/img/gota_vinho_lado.png");
        this.load.image("gota-vinho-torta", "src/img/gota_vinho_tortona.png");

        this.load.image("prato", "src/img/prato.png");
        this.load.image("prato-ec", "src/img/prato-esquerda-cima.png");
        this.load.image("prato-dc", "src/img/prato-direita-cima.png");
        this.load.image("prato-eb", "src/img/prato-esquerda-baixo.png");
        this.load.image("prato-db", "src/img/prato-direita-baixo.png");        

        this.load.json("fase", "src/fases/fase.json");

        for(let i=0; i<=16; i++){
            this.load.image("efeito-circulo-" + i, "src/cuphead/efeito-circulo/irisA_00" + (i < 10 ? "0" : "1") + (i < 10 ? i : i-10) + ".png") ;
        }
    }

    create() {

    }

    update() {

    }
}