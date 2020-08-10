import Projetil from "./projetil.js"

export class Tiro extends Projetil{
    constructor(cena, x, y, imagem_custom="tiro", dano=1){        
        const tam = { w: 24, h: 24 };

        super(cena, x, y, imagem_custom || "tiro", tam);
        
        this.dano = 1;
    }

    foraDaTela(){
        return this.x > this.cena_tam.w + this.tamanho.w/2;
    }

    update(){
        this.setVelocityX(800);

        super.update();
    }

    aparecer(){
        super.aparecer();
        this.setVisible(true);
    }

    destruir(){
        super.destruir();
        this.setVisible(false);
    }
}

export class TiroForte extends Tiro {
    constructor(cena, x, y) {
        super(cena, x, y, "tiro-forte", 2);
        this.x_base = x;
    }

    update(){
        super.update();
        if(this.x > this.x_base+250)
            this.destruir();
    }

    aparecer(){
        super.aparecer();
        this.x_base = this.x;
    }

}

export class Atirador{
    constructor(cena, sprite, tps=1000, classeTiro = Tiro){
        this.cena = cena;
        this.tiros_por_segundo = tps;
        this.sprite = sprite;
        this.classeTiro = classeTiro;

        this.grupo = cena.physics.add.group({ classType: classeTiro, runChildUpdate: true });
        this.cooldown = false;
    }


    atirar(){
        if(this.cooldown) return null;

        let {x,y} = this.sprite;
        x+=this.sprite.sprite.displayWidth / 2 + 12;
        y-=24;

        let tiro = this.grupo.get(x,y);
        tiro.aparecer(true);

        this.cooldown = true;
        setTimeout(()=>this.cooldown=false, this.tiros_por_segundo);
    }
}