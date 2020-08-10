export default class CenaMenuInicial extends Phaser.Scene {
    // Essa cena irá pre carregar o menu

    constructor() {
        super({
            key: "CenaMenuInicial"
        });
    }

    preload() {

    }

    create() {
        const canvas_width = this.sys.canvas.width;
        const canvas_height = this.sys.canvas.height;

        const fundo = this.add.image(0, 0, "menu-background");
        fundo.setOrigin(0, 0);
        fundo.displayHeight = canvas_height;
        fundo.displayWidth = canvas_width;
        window["fundo"]=fundo;

        const distancia_texto = 48;

        const estilo_texto = { fontSize: distancia_texto+'px', fill: '#fff', fontFamily: 'OpenSans', align: 'center' };

        const meio_w = canvas_width/2;
        const meio_h = canvas_height/2;

        const info_texto = {
            "start": {
                y_offset: -distancia_texto,
                text: "START",
                callback: () => this.scene.start("CenaCarregamento")
            },
            "options": {
                y_offset: 0,
                text: "OPTIONS",
                callback: ()=> console.log("options")
            },
            "credits": {
                y_offset: +distancia_texto,
                text: "CREDITS",
                callback: () => console.log("credits")
            },
        };

        this.texto = {};

        function deselectAll(){
            for (let texto in this.texto) {
                this.texto[texto].setAlpha(0.6);
            }
        }
        deselectAll = deselectAll.bind(this);

        for(let option_name in info_texto){
            let option = info_texto[option_name];
            let texto = this.add.text(meio_w, meio_h + option.y_offset, option.text, estilo_texto).setOrigin(0.5);
            this.texto[option_name] = texto;

            texto.setInteractive({ cursor: 'pointer' });

            texto.on('pointerup', function () {
                option.callback();
            }, this);

            texto.on('pointerover', function () {
                deselectAll();
                texto.setAlpha(1);
            }, this);

            deselectAll();
            this.texto["start"].setAlpha(1);
        }
    }

    update() {

    }
}