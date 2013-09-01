/**
 * Personagem Tank. 
 * 
 * Herda da classe Sprite. Seu construtor recebe como par�metros o
 * x, y onde o tank come�ar� no jogo.
 */
var Tank = enchant.Class.create(enchant.Sprite, {
	
	/**
	 * Construtor da classe Tanque.
	 */
	initialize: function (x, y) {
	
		/**
		 * Construtor da classe pai. 
		 */
		enchant.Sprite.call(this, 86, 86);
		
		this.image = game.assets["/images/mobile_tank.png"];
		
		this.frame = [5];
		
		this.direcao = DIR_DIREITA;
		
		this.prevX = 0;
    	
    	this.x = x;
    	 
    	this.y = y;
    	
    	this.keyClear = false;
    	
    	this.pulando = false;
    	
    	this.velocidade = 2;
    	
    	this.aceleracao = 0.5;
    	
    	this.aceleracaoCima = 0;
    	
    	this.aceleracaoBaixo = 0;
    	
    	this.tempoAr = 0;
    	
		/**
		 * Evento update do tanque
		 * 
		 * Atualiza seu comportamento.
		 * O que � feito nesta fun��o:
		 * 	Tratamento de entrada do usu�rio para movimenta��o do tanque.
		 *  
		 */
    	this.addEventListener("enterframe", function() {
    		
    		/**
    		 * Grava a posi��o x antiga.
    		 * 
    		 */ 
    		this.prevX = this.x;
    		
	    	if (!game.input.up && !this.pulando) {
	    		this.keyClear = true;
	    	}
	    	
	    	/**
	    	 * Tanque pula ao pressionar tecla para cima.
	    	 *  
	    	 */
	    	if (game.input.up && this.keyClear && !this.pulando && this.aceleracaoBaixo <= 0) {
	    		
	    		this.aceleracaoCima = VELOCIDADE_PULO / 2;
	    		
	    		this.aceleracaoBaixo = 0;
	    		
	    		this.pulando = true;
	    		
	    		this.keyClear = false;
	    		
	    		/**
	    		 * Anima��o do frame.
	    		 * 
	    		 */
        		if (this.direcao == DIR_DIREITA) {
            		
            		this.frame = [12];
            	}
            	else {
            		
            		this.frame = [11];
            	}
	    	}
	    	
	    	/**
	    	 * Limita��o do pulo.
	    	 *  
	    	 */
            else if (game.input.up && this.pulando && this.tempoAr > 1 && this.tempoAr < 12) {
            	
                this.aceleracaoCima += 0.25;
            }
            
            /**
             * Queda mais r�pida se o pulo n�o foi t�o alto.
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
				if (this.aceleracaoCima > 0) {
					
					this.aceleracaoCima--;
				}
				else if (this.aceleracaoBaixo < VELOCIDADE_PULO) {
					
					this.aceleracaoBaixo += 0.3;
				}
					
			}
	    	
			/**
			 * Jogador d� comando da esquerda.
			 *  
			 */
			if (game.input.left && this.x > 0) { 
				this.x -= this.velocidade * this.aceleracao;
				
				/**
				 * Anima��o do frame.
				 * 
				 */
				if (this.pulando) {
					
					this.frame = [11];
				}
				else {
					
					var agesum = (this.age/4) % 3;
					this.frame = [ agesum ];
				}
				
				this.direcao = DIR_ESQUERDA;
			}
			
			/**
			 * Jogador d� comando da direita.
			 *  
			 */
			else if (game.input.right && this.x + this.width < ambiente.width) { 
				this.x += this.velocidade * this.aceleracao;
				
				/**
				 * Anima��o do frame.
				 * 
				 */
				if (this.pulando) {
					
					this.frame = [12];
				}
				else {
					
					var agesum = 7-(Math.round(this.age/4) % 3);
					this.frame = [ agesum ];	
				}
				
				this.direcao = DIR_DIREITA;
			}
				

            /**
             * Atualiza a acelera��o de movimento.
             *  
             */
            if ((game.input.left && this.prevX > this.x) || (game.input.right && this.prevX < this.x))
                this.aceleracao += 0.05;
            else
                this.aceleracao = 0.05;

            // Captura acelera��o em 1
            if (this.aceleracao > 1)
                this.aceleracao = 1;
			
			// Pulo final
			if (this.aceleracaoCima > 0)
				this.y = this.y - this.aceleracaoCima;
			// Queda final
			else if (this.aceleracaoCima < 1) {
				this.y = this.y + this.aceleracaoBaixo;
			}
			
			/**
			 * Anima��o do frame.
			 * 
			 * Objeto em queda.
			 * 
			 */
			if (this.aceleracaoBaixo > 0 && this.pulando) {
				if (this.direcao == DIR_DIREITA) {
					
					this.frame = [13];	
				}
				else {
					
					this.frame = [10];
				}	
			}
			
            // Atualizar tempo no ar.
            if (this.pulando)
                this.tempoAr++;
            else {
            	this.tempoAr = 0;

            	/**
            	 * Anima��o do frame.
            	 *  
            	 * Se o Sprite estiver parado.
            	 * 
            	 */
            	if (this.aceleracao <= 0.5) {
            		
            		if (this.direcao == DIR_DIREITA) {
                		
                		this.frame = [7];
                	}
                	else {
                		
                		this.frame = [1];
                	}
            	}
            }
    	});
	},
	
});