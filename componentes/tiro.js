export class Tiro extends Phaser.Physics.Arcade.Image{
    constructor(cena, x, y, dano=1){
        super(cena, x, y, "tiro");

        this.cena = cena;
        this.identi = Math.random();

        const tam = { w: 18, h: 18 };
        this.tam = tam;

        //this.setCollideWorldBounds(true);
        const scale = Math.max(tam.w / this.width, tam.h / this.height);
        this.setScale(scale);

        this.dano = 1;
    }

    foraDaTela() {
        return this.x + this.tam.w / 2 > this.cena.cameras.main.width;
    }

    update(){
        this.setVelocityX(280);

        if(this.foraDaTela())
            this.destruir();
    }

    aparecer(){
        this.setActive(true);
        this.setVisible(true);
    }

    destruir(){
        this.setActive(false);
        this.setVisible(false);
    }
}

export class Atirador{
    constructor(cena, sprite, tps=1000, dano=1){
        this.cena = cena;
        this.tiros_por_segundo = tps;
        this.dano = dano;
        this.sprite = sprite;

        this.grupo = cena.physics.add.group({ classType: Tiro, maxSize: 50, runChildUpdate: true });
        this.cooldown = false;
    }


    atirar(){
        if(this.cooldown) return null;

        let {x,y} = this.sprite;

        let tiro = this.grupo.get(x,y);
        tiro.aparecer(true);

        this.cooldown = true;
        setTimeout(()=>this.cooldown=false, this.tiros_por_segundo);
    }
}