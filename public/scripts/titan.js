/**
 * Personagem Titan. 
 * 
 * Herda da classe Sprite. Seu construtor recebe como par�metros o
 * x, y onde o titan come�ar� no jogo.
 */
var Titan = enchant.Class.create(enchant.Sprite, {
	
	/**
	 * Construtor da classe Titan.
	 */
	initialize: function (x, y) {
	
		/**
		 * Construtor da classe pai. 
		 */
		enchant.Sprite.call(this, 86, 86);
		
		this.image = game.assets["/images/mobile_titan.png"];
		
		this.frame = [1];
		
		this.prevX = 0;
    	
    	this.x = x;
    	 
    	this.y = y;
    	
    	this.keyClear = false;
    	
    	this.pulando = false;
    	
    	this.caindo = true;
    	
    	this.velocidade = 4;
    	
    	this.aceleracao = 0.5;
    	
    	this.aceleracaoCima = 0;
    	
    	this.aceleracaoBaixo = 0;
    	
    	this.tempoAr = 0;
    	
    	/*
    	 * Pseudo-teclas usadas pelo WebSocket para controlar o
    	 * robô inimigo. 
    	 * 
    	 */
    	this.websocketKeys = {
    		up: false,
    		right: false,
    		down: false,
    		left: false
    	};

		/**
		 * Evento update do robô.
		 * 
		 * Atualiza seu comportamento.
		 * O que é feito nesta função:
		 * 	Tratamento de entrada do usuário para movimentação do robô.
		 *  
		 */
    	this.addEventListener("enterframe", function() {
    		
    		/**
    		 * Grava a posição x antiga.
    		 * 
    		 */ 
    		this.prevX = this.x;
    		
	    	if (!game.input.up && !this.pulando) {
	    		this.keyClear = true;
	    	}
	    	
	    	/**
	    	 * Robô pula ao pressionar tecla para cima.
	    	 *  
	    	 */
	    	if (this.websocketKeys.up && this.keyClear && !this.pulando && this.aceleracaoBaixo <= 0) {
	    		
	    		this.aceleracaoCima = VELOCIDADE_PULO / 2;
	    		
	    		this.aceleracaoBaixo = 0;
	    		
	    		this.pulando = true;
	    		
	    		this.keyClear = false; 
	    	}
	    	
	    	/**
	    	 * Limitação do pulo.
	    	 *  
	    	 */
            else if (this.websocketKeys.up && this.pulando && this.tempoAr > 1 && this.tempoAr < 12) {
            	
                this.aceleracaoCima += 0.25;
            }
            
            /**
             * Queda mais rápida se o pulo não foi tão alto.
             *
             */  
            else if (this.pulando && this.aceleracaoCima > 0 && this.tempoAr < 50) {
            	
                this.aceleracaoCima -= 2;
            }
            
			/**
			 * Atualiza gravidade.
			 *
			 */  
			else {
				if (this.aceleracaoCima > 0)
					this.aceleracaoCima--;
				else if (this.aceleracaoBaixo < VELOCIDADE_PULO)
					this.aceleracaoBaixo += 0.3;
			}
			
			/**
			 * Jogador dá comando da esquerda.
			 *  
			 */
			if (this.websocketKeys.left && this.x > 0) { 
				this.x -= this.velocidade * this.aceleracao;
			}
			
			/**
			 * Jogador dá comando da direita.
			 *  
			 */
			if (this.websocketKeys.right && this.x + this.width < ambiente.width) { 
				this.x += this.velocidade * this.aceleracao;
			}

            /**
             * Atualiza a aceleração de movimento.
             *  
             */
            if ((this.websocketKeys.left && this.prevX > this.x) || (game.input.right && this.prevX < this.x))
                this.aceleracao += 0.05;
            else
                this.aceleracao = 0.05;

            // Captura aceleração em 1
            if (this.aceleracao > 1)
                this.aceleracao = 1;
			
			// Pulo final
			if (this.aceleracaoCima > 0)
				this.y = this.y - this.aceleracaoCima;
			// Queda final
			else if (this.aceleracaoCima < 1) {
				this.y = this.y + this.aceleracaoBaixo;
			}
			

            // Atualizar tempo no ar.
            if (this.pulando)
                this.tempoAr++;
            else
                this.tempoAr = 0;
                
    	});
	},
	
});