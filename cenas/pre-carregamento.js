export default class CenaPreCarregamento extends Phaser.Scene {
    // Essa cena irá pre carregar o menu

    constructor() {
        super({
            key: "CenaPreCarregamento"
        });
    }

    preload() {
        this.load.on("complete", () => this.scene.start("CenaMenuInicial"));

        this.load.image("menu-background", "src/cuphead/menu_background.png");
        this.load.image("card", "src/cuphead/card.png");

    }

    create() {

    }

    update() {

    }
}