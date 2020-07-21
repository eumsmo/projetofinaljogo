import CenaCarregamento from "./cenas/carregamento.js"
import CenaJogo from "./cenas/jogo.js"

const config = {
    tpe: Phaser.AUTO,
    width: 800,
    height: 480,
    parent: "jogo",
    scene: [
        CenaCarregamento,
        CenaJogo
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
};

const jogo = new Phaser.Game(config);

