export default class Pizza extends Phaser.Physics.Arcade.Image{
    constructor(cena, y = 100){

        const cena_tam = {
            w: cena.cameras.main.width,
            h: cena.cameras.main.height
        }

        const sprite_tam = { w: 64, h: 64 };


        super(cena, cena_tam.w, y, "pizza");

        this.cena = cena;
        this.y_base = y;
        this.cena_tam = cena_tam;
        this.tamanho = sprite_tam;

        //this.setCollideWorldBounds(true);

        const scale = Math.max(sprite_tam.w / this.width, sprite_tam.h /this.height);
        this.setScale(scale);

        this.vida = 5;
    }

    dano(tiro){
        let dano = tiro.dano;
        this.vida -= dano;
        
        console.log(this.vida, dano);
        if(this.vida <= 0)
            this.destruir();
    }

    foraDaTela(){
        return this.x < -this.tamanho.w/2;
    }
    
    update(){
        this.setVelocityX(-280);
        this.y = this.y_base + Math.cos(this.x / 40) * 20;

        if(this.foraDaTela())
            this.destruir();
    }

    aparecer(y){
        this.setActive(true);
        //this.setVisible(true);

        this.y_base = y;
        this.x = this.cena_tam.w;

        this.vida = 5;
    }

    destruir() {
        this.setActive(false);
        //this.setVisible(false);
    }
}

let infos = {
    w: 64,
    h: 64,
    sprite: "pizza",
    velocidadeX: -280,
    movimentoY: {
        tipo: "senoide",
        divisor: 40,
        multiplicador: 20
    },
    aoMorrer: null, //padrão
    hp: 3,

}