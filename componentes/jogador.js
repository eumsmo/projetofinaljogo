import { Atirador } from "./tiro.js";

export default class Jogador {
    constructor(cena) {
        this.cena = cena;

        this.scene_w = this.cena.cameras.main.width;
        this.scene_h = this.cena.cameras.main.width;

        const tam = { w: 96, h: 96 }
        this.tam = tam;
        this.sprite = cena.physics.add.image(0, this.scene_h/2, "cadeira");
        this.sprite.setCollideWorldBounds(true);
        const scale = Math.max(tam.w / this.sprite.width, tam.h / this.sprite.height);
        this.sprite.setScale(scale);

        this.sprite.allowGravity = false;

        this.atirador = new Atirador(cena, this, 100);

        this.vida = 3;
        this.dano_cooldown = false;
    }

    dano(){
        if(this.dano_cooldown) return;

        this.vida--;
        if(this.vida<=0){
            alert("morte");
            this.vida=3;
        } else {

        }

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
        const vHorizontal = 320;
        const vVertical = 320;

        const jogador = this.sprite;

        if (teclas.left.isDown) {
            jogador.setVelocityX(-(vHorizontal));
        }
        else if (teclas.right.isDown) {
            jogador.setVelocityX(vHorizontal);
        } 
        else {
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
            this.atirador.atirar();
        }
    }

    get x() { return this.sprite.x }
    set x(x) {return this.sprite.x = x}
    get y() { return this.sprite.y }
    set y(y) { return this.sprite.y = y }
}