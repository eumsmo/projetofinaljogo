import Jogador from "../componentes/jogador.js";
import { Ataque, Ataques} from "../componentes/grupo_ataque.js";
import Projetil from "../componentes/projetil.js";

export default class CenaJogo extends Phaser.Scene {
    constructor(){
        super({
            key: "CenaJogo"
        });

        window["jogo"] = this;
    }

    preload(){
        // Carregado na CenaCarregamento
    }

    gerencia_fundo(){
        const velocidade = 3;
        this.fundo.x -= velocidade;
        this.fundo2.x -= velocidade;

        if (this.fundo.x <= -this.cw / 2) this.fundo.x = (this.cw + this.cw / 2) - velocidade;
        else if (this.fundo2.x <= -this.cw / 2) this.fundo2.x = (this.cw + this.cw / 2) - velocidade;
    }

    create(){
        
        const fase = this.cache.json.get("fase");
        console.log(fase);

        Object.assign(Ataques, fase.ataques_disponiveis);

        const canvas_width = this.sys.canvas.width;
        const canvas_height = this.sys.canvas.height;

        this.cw = canvas_width;
        this.ch = canvas_height;
        
        this.fundo = this.add.image(canvas_width / 2, canvas_height / 2, "background-jogo");
        this.fundo2 = this.add.image(canvas_width / 2 + canvas_width, canvas_height/2, "background-jogo");
        //this.fundo.setScale(canvas_width / this.fundo.width);
        //this.fundo2.setScale(canvas_width / this.fundo2.width);

        const distanciaQuadroHp = 16;
        const xQuadroHP = distanciaQuadroHp;
        const yQuadroHP = canvas_height - distanciaQuadroHp / 2;
        const wQuadroHP = 150;
        const hQuadroHP = 75;


        this.quadroHP = this.add.image(xQuadroHP, yQuadroHP, "quadro-hp");
        this.quadroHP.setOrigin(0, 1);
        this.quadroHP.displayHeight = hQuadroHP;
        this.quadroHP.displayWidth = wQuadroHP;

        const estilo_texto = { fontSize: '48px', fill: '#000', fontFamily: 'OpenSans', align: 'center' };
        this.textoHP = this.add.text(xQuadroHP + wQuadroHP/2, yQuadroHP - hQuadroHP/2, "HP. 3", estilo_texto);
        this.textoHP.setOrigin(0.5);
        //this.quadroHP.setSize(200, 100);

        this.jogador = new Jogador(this);
        this.textoHP.setText("HP. " + this.jogador.vida);

        this.template_grupos = {};
        this.inimigos = this.physics.add.group();

        this.teclas = this.input.keyboard.createCursorKeys();


        let grupoCena = Ataque.parseInformation(this, fase.ataque_inicial);
        window["grupo"] = grupoCena;
        grupoCena.comecar();

        window["ultimo_ataque_tempo"] = Date.now();
        window["primeiro_ataque"] = false;
        this.cooldown_ataque = false;
    }

    cria_template_grupo(template){
        if(!(template in this.template_grupos))
            this.template_grupos[template] = this.physics.add.group({ classType: Projetil,runChildUpdate: true});
    }

    get_from_template_grupo(template, infos){
        if(!(template in this.template_grupos)) return;

        let obj = this.template_grupos[template].get(infos.x,infos.y,infos.sprite);
        if (obj){
            this.inimigos.add(obj);
            obj.aparecer(infos);
            return obj;
        }
        
    }

    update(){
        this.physics.add.overlap(this.inimigos, this.jogador.atirador.grupo, this.colisao, this.colidiuMesmo);
        this.physics.add.overlap(this.jogador.sprite, this.inimigos, ()=>this.colisaoJogador(), this.colidiuMesmo);


        this.jogador.update();
        this.jogador.inputTeclado(this.teclas);

        this.gerencia_fundo();

        if (Date.now() - window["ultimo_ataque_tempo"] >= 3000 && window["primeiro_ataque"]) {
            window["grupo"]._run();
            window["primeiro_ataque"] = false;
        }
    }

    colidiuMesmo(obj1,obj2){
        return obj1.active && obj2.active;
    }

    colisao(inimigo, tiro){
        inimigo.dano(tiro);
        tiro.destruir();
    }

    mostrarGameover(){
        this.retanguloMorte = this.add.rectangle(this.cw / 2, this.ch / 2, this.cw, this.ch, 0x000000);
        this.retanguloMorte.setOrigin(0.5);
        this.retanguloMorte.alpha = 0.5;

        const estilo_texto_morte = { fontSize: '128px', fill: '#fff', fontFamily: 'OpenSans', align: 'center' };
        this.textoMorte = this.add.text(this.cw / 2, this.ch / 2, "YOU DIED!", estilo_texto_morte);
        this.textoMorte.setOrigin(0.5);

        
        let frames=[];
        for (let i = 16; i>=0; i--)
        frames.push({ key: "efeito-circulo-"+i});
        
        this.anims.create({
            key: 'circulo',
            frames: frames,
            frameRate: 10,
        });
        
        let mostrar = this.add.sprite(this.cw / 2, this.ch / 2, "efeito-circulo-16");
        mostrar.displayWidth = this.cw;
        mostrar.displayHeight = this.ch;
        mostrar.on('animationcomplete', () => {
            window.location.reload();
            //this.scene.start("CenaMenuInicial");
        }, this);

        setTimeout(() => mostrar.play("circulo"), 500);
    }

    colisaoJogador(){
        this.jogador.dano();
        this.textoHP.setText("HP. "+this.jogador.vida);

        if (this.jogador.vida <= 0 && !this.gameover){
            this.mostrarGameover();
            this.physics.pause();
            this.gameover = true;
        }
    }
}