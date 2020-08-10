import Projetil from "./projetil.js";
import Condicoes from "./condicao.js"

export const Ataques = {

}

export class Ataque{
    constructor(cena){
        this.cena = cena;
        this._status = 0;
        this._promiseFunctions = {};
    }

    // Sobreescrever esse método (chamar o super)
    comecar(){
        this._status = 1;
        this.promesa = new Promise((resolve, reject) => this._promiseFunctions = { resolve, reject });
        return this.promesa;
    }

    // Sobreescrever esse método (chamar o super)
    terminar(){
        if(this.terminou) return false;

        this._status = 2;
        
        if("resolve" in this._promiseFunctions)
            this._promiseFunctions.resolve(this);
        
        return true;
    }

    get comecou(){return this._status >= 1;}
    get terminou(){return this._status == 2;}

    static parseInformation(cena, nome){
        const informacoes = Ataques[nome];
        const configuracoes = informacoes._config;
        const tipo = configuracoes.tipo;


        if (tipo == "unico") {
            const template_name = informacoes.sprite;

            return new AtaqueUnico(cena, template_name, informacoes);
        } else if (tipo == "sequencial") {
            const ataques = informacoes.ataques;
            const ordem = informacoes.sequencia;

            return new GrupoSequencial(cena, ataques, configuracoes, ordem);
        } else if (tipo == "aleatorio") {

        }
    }
}


export class AtaqueUnico extends Ataque{
    constructor(cena, template_name, infos){
        super(cena);
        
        this.template_name = template_name;
        this.infos = infos;

        this.obj;

        if (!(template_name in this.cena.template_grupos)){
            this.cena.cria_template_grupo(template_name);
        }
    }

    comecar(){
        this.obj = this.cena.get_from_template_grupo(this.template_name, this.infos);
        this.obj.on(Projetil.DESTRUIR_EVENT, ()=> this.terminar());

        return super.comecar();
    }

}

export class GrupoAtaque extends Ataque{ 

    constructor(cena, ataques_disponiveis, options={}){
        super(cena);

        this.ataques_disponiveis = ataques_disponiveis;
        this.quant_ataques_feitos = 0;
        this.em_cooldown = false;
        
        /* Opções */
        // Cooldown de ataque
        this.cooldown_ataque = options.cooldown_ataque == undefined ? null : options.cooldown_ataque;

        // Condicao de checar
        if(options.cond_termino){
            this.cond_checar = ("cond_checar" in options.cond_termino)? options.cond_termino.cond_checar : "fim_ataque";
        }
        
        // Condicao de termino
        this.cond_termino = []; 
        let condicoes_create = [], condicoes_promesa = [];

        let aux = options.cond_termino || {};
        for(let nome_condicao in aux){
            if(nome_condicao == "cond_checar") continue;

            let condicao = Condicoes.pegar(nome_condicao, { value: aux[nome_condicao]} );
            if("create" in condicao)
                condicoes_create.push(condicao);
            if("promesa" in condicao)
                condicoes_promesa.push(condicao);
            if("checar" in condicao)
                this.cond_termino.push(condicao);
        }

       

        this._run = this._run.bind(this);
        this._fimDeUmAtaque = this._fimDeUmAtaque.bind(this);

        condicoes_create.forEach(condicao=> condicao.create(this));
        condicoes_promesa.forEach(condicao=> condicao.promesa(this).then(()=>this.terminar()));
    }   

    comecar(){
        const promesa = super.comecar(); 
        this._run();
        return promesa;
    }

    proximo(){
        return null;
    }

    // Devia ser protected
    _run(){
        if(this.terminou) return;

        this.em_cooldown = false;
        let ataque = this.proximo();

        if(ataque==null)
            return this.terminar();

        let promesa = ataque.comecar();
        this._novoAtaque();

        if (this.cooldown_ataque != null && !isNaN(this.cooldown_ataque)) { // Se cooldown_ataque for um numero

            promesa.then(this._fimDeUmAtaque);

            if (this.cooldown_ataque != 0) {
                this.em_cooldown = true;
                setTimeout(this._run, this.cooldown_ataque);
            } else {
                this._run();
            }

        } else {
            this.em_cooldown = true;
            promesa.then(()=>{
                this._fimDeUmAtaque();
                this._run();
            });
        }

    }

    _novoAtaque(){
        this.quant_ataques_feitos++;
    }

    _fimDeUmAtaque(){
        if(this.cond_checar == "fim_ataque"){
           for(let condicao of this.cond_termino)
               if (condicao.checar(this))
                return this.terminar(true);
           
        }
    }

}

function range(start, end){
    if(!end) 
        [start,end]=[0,start];
    
    return Array(end-start+1).fill().map((_,idx)=> start+idx);
}

function randInt(min,max=undefined){
    if(!NaN(max))
        [min, max] = [0, min];

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class GrupoSequencial extends GrupoAtaque{
    /*
        Se apresentado o parametro ordem, o tipo do grupo será sequencial definido, caso contrário será sequencial aleatorio
    */

    constructor(cena,ataques_disponiveis, options, ordem = null){
        super(cena,ataques_disponiveis, options);

        this.tipo = ordem? "sequencial definido" : "sequencial aleatorio";
        this.ordem = ordem;
        this.posicao_atual;

        this._proximo_ataque=null;

        this.fim_sequencia = options.fim_sequencia || "terminar";
    }

    comecar(){
        if(this.tipo == "sequencial aleatorio"){
            let chaves = this.ataques_disponiveis;
            let ordem = GrupoSequencial.gerarVetorOrdem(chaves.length - 1);
            this.ordem = ordem.map(idx=> chaves[idx]);
        }

        this.posicao_atual = 0;

        return super.comecar();
    }

    static gerarVetorOrdem(numero) {
        return range(numero).sort(() => Math.random() - 0.5);
    }

    proximo(){
        if (!this._proximo_ataque || this._proximo_ataque.comecou){
            if(this.posicao_atual>=this.ordem.length){
                return null;
            }
            let nome_ataque = this.ordem[this.posicao_atual];

            this._proximo_ataque = Ataque.parseInformation(this.cena, nome_ataque);
            this.posicao_atual++;
        }

        return this._proximo_ataque;
    }

    terminar(ignorar_condicao=false){
        if (!ignorar_condicao && this.fim_sequencia == "repetir") {
            return this.comecar();
        }

        return super.terminar();
    }

}

export class GrupoAleatorio extends GrupoAtaque{
    constructor(cena, ataques_disponiveis, options, pode_repetir = false){
        super(cena, ataques_disponiveis, options);
        
        this.tipo = pode_repetir ? "parcialmente_aleatorio" : "totalmente_aleatorio";
        
        this._proximo_ataque=null;
    }

    proximo(){
        if (!this._proximo_ataque || this._proximo_ataque.comecou) {
            if (this.posicao_atual >= this.ordem.length) {
                return null;
            }
            let ClasseAtaque = this.ataques_disponiveis[this.ordem[this.posicao_atual]];
            this._proximo_ataque = new ClasseAtaque(this.cena);
            this.posicao_atual++;
        }

        return this._proximo_ataque;
    }
}