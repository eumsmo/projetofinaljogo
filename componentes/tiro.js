import Projetil from "./projetil.js"

export class Tiro extends Projetil{
    constructor(cena, x, y, dano=1){        
        const tam = { w: 18, h: 18 };

        super(cena, x, y, "tiro", tam);
        
        this.dano = 1;
    }

    foraDaTela(){
        return this.x > this.cena_tam.w + this.tamanho.w/2;
    }

    update(){
        this.setVelocityX(280);

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

export class Atirador{
    constructor(cena, sprite, tps=1000, classeTiro = Tiro){
        this.cena = cena;
        this.tiros_por_segundo = tps;
        this.sprite = sprite;
        this.classeTiro = classeTiro;

        this.grupo = cena.physics.add.group({ classType: classeTiro, maxSize: 50, runChildUpdate: true });
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