import { Atirador, TiroForte, Tiro } from "./tiro.js";

export default class Jogador {
    constructor(cena) {
        this.cena = cena;

        this.scene_w = this.cena.cameras.main.width;
        this.scene_h = this.cena.cameras.main.height;

        const tam = { w: 86, h: 86 }
        const inicial = {x: 128, y: this.scene_h/2};
        this.tam = tam;


        this.sprite = cena.physics.add.sprite(inicial.x, inicial.y, "atirando");
        this.sprite.setCollideWorldBounds(true);

        this.cena.anims.create({
            key: 'atirador',
            frames: [
                { key: "atirando" },
                { key: "atirando2" }
            ],
            frameRate: 2,
            repeat: -1
        });

        this.sprite.play('atirador');

        //const scale = Math.max(tam.w / this.sprite.width, tam.h / this.sprite.height);
        this.sprite.setScale(0.5);

        this.sprite.allowGravity = false;

        this.atirador = new Atirador(cena, this, 225, Tiro);
        this.atiradorForte = new Atirador(cena, this, 300, TiroForte);
        this.atirador_atual = 1;

        this.vida = 3;
        this.dano_cooldown = false;

        this.cooldown_muda_arma = false;
    }

    dano(){
        if(this.dano_cooldown) return;

        this.vida--;

        this.dano_cooldown = true;
        let intervalo = setInterval(()=>this._spritePiscando(), 300);
        setTimeout(()=>{
            this.dano_cooldown = false;
            clearInterval(intervalo);
            this.sprite.alpha = 1;
        }, 2000);
    }

    _spritePiscando(){
        if (this.sprite.alpha == 1) this.sprite.alpha = 0.5;
        else this.sprite.alpha = 1; 
    }

    update(...args){
        
    }

    inputTeclado(teclas){
        const vHorizontal = 480;
        const vVertical = 480;

        const jogador = this.sprite;
        const var_angulo = 2.5;
        const base_angulo = 2;


        if (teclas.shift.isDown && !this.cooldown_muda_arma){
            this.cooldown_muda_arma=true;
            setTimeout(()=>this.cooldown_muda_arma=false,1000);

            if (this.atirador_atual == 1) this.atirador_atual=2;
            else this.atirador_atual=1;
        }


        if (teclas.left.isDown) {
            jogador.setVelocityX(-(vHorizontal));
            jogador.angle = base_angulo-var_angulo;
        }
        else if (teclas.right.isDown) {
            jogador.setVelocityX(vHorizontal);
            jogador.angle = base_angulo+var_angulo;

        } 
        else {
            jogador.angle = base_angulo;
            jogador.setVelocityX(0);
        }

        if (teclas.up.isDown) {
            jogador.setVelocityY(-vVertical);
        } 
        else if (teclas.down.isDown) {
            jogador.setVelocityY(vVertical);
        }
        else {
            jogador.setVelocityY(0);
        }


        if (teclas.space.isDown) {
            if (this.atirador_atual==1)
                this.atirador.atirar();
            else
                this.atiradorForte.atirar();
        }
    }

    get x() { return this.sprite.x }
    set x(x) {return this.sprite.x = x}
    get y() { return this.sprite.y }
    set y(y) { return this.sprite.y = y }
}