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
        this.load.image("pizza", "src/img/pizza.png");
        this.load.image("cadeira", "src/img/chair.png");
        this.load.image("tiro", "src/img/tiro.png");
        this.load.image("garfo", "src/img/garfo.png");

        this.load.json("fase", "src/fases/fase.json");
    }

    create() {

    }

    update() {

    }
}