/**
 * enchant();
 * Preparação para o uso do enchant.js.
 * (Exporta a classe enchant.js para o namespace global.
 *  ex.: enchant.Sprite -> Sprite etc..)
 *
 */
enchant();

/**
 * Declara��o pr�via do objeto jogo e objetos associados, possibilita que fun��es
 * os visualizem.
 *  
 */ 
var game;

var ambiente;

/**
 * Constantes do jogo. 
 */
var VELOCIDADE_PULO = 18.5;
var ESPACO_COLISAO = 6;
var DIR_DIREITA = 0;
var DIR_ESQUERDA = 1;

/**
 * Vari�veis do jogo.
 * 
 */
var blocos = new Array;

var comeco = Date.now();

/*
 * window.onload
 *
 * A fun��o ser� executada ap�s o carregamento da p�gina.
 * Comandos na enchant.js como "new Core();" causar�o erros se executados antes do carregamento da p�gina inteira.
 *
 */
window.onload = function() {
    /**
     * new Core(width, height)
     *
     * Cria uma inst�ncia de enchant.Core. Define o tamanho da janela para 320x320.
     * 
     */
	game = new Core(800, 600);
	
	/**
	 * Core.fps
	 * 
	 * Define o fps (frames por segundo) do jogo para 60.
	 *  
	 */
	game.fps = 60;
	
	/**
	 * Core.scale
	 * 
	 * Define a escala do jogo para 1, mantendo o aspecto gráfico original.
	 *  
	 */
	game.scale = 1;
	
	/**
	 * Core.keybind(tecla, id)
	 * 
	 * Faz o binding das teclas W, A, S e D para as direções Cima, Esquerda, 
	 * Baixo e Direita, respectivamente. 
	 *  
	 */
	game.keybind(65, 'left');	
	game.keybind(68, 'right');
	game.keybind(87, 'up');
	game.keybind(83, 'down');
	
    /**
     * Core.preload(resource)
     *
     * É realizado o carregamento de todos os assets antes do jogo começar.
     * 
     */
    game.preload(
    	"/images/mobile_tank.png",
    	"/images/mobile_titan.png",
    	"/images/background.jpg", 
    	"/images/block.png",
    	"/audios/rock.mp3"
    );
    
    /**
     * Core.onload()
     *
     * game.onload = function(){
     *     // code
     * }
     *
     * game.addEventListener("load", function(){
     *     // code
     * })
     */
    game.onload = function() {

		ambiente = new Sprite(800, 600);
		
		ambiente.image = game.assets["/images/background.jpg"];
		
		//game.assets['/audios/rock.mp3'].play();
		
		ambiente.x = ambiente.y = 0;
		
    	var tank = new Tank(260, 200);
    	
    	var titan = new Titan(500, 200);
    	
    	/**
    	 * ambiente touchend
    	 * 
    	 * Ao soltar o clique no ambiente, realizar ação selecionada, que pode ser:
    	 * 
    	 * 	Criar bloco no ambiente.
    	 * 	Destruir bloco do ambiente.
    	 * 	Criar bloco de mola no ambiente.
    	 * 	Criar bloco transpassado no ambiente.
    	 *  
    	 */
    	ambiente.addEventListener("touchend", function(evt) {
    		
			addBloco(evt.localX, evt.localY);
    	});
    	
    	
    	/**
    	 * game on enterframe 
    	 * 
    	 * Realiza verificações e operações do jogo que acontecem a cada frame.
    	 * 
    	 * O que é feito nesta função:
    	 * 	Testes de colisão dos robôs com blocos.
    	 *  Testes de colisão entre os robôs (Falta Implementar). 
    	 *  
    	 */
    	game.addEventListener("enterframe", function(evt) {
    		
    		/**
    		 * Testes de colisão do robô com os blocos.
    		 *  
    		 */
    		for (var b = 0; b < blocos.length; b++) {
    			
    			/**
    			 * Rob� colide com o bloco por baixo (cabeceando).
    			 *  
    			 */
    			if ( tank.y < blocos[b].y + blocos[b].height && tank.y > blocos[b].y 
    				&& tank.x + tank.width > blocos[b].x + ESPACO_COLISAO 
    				&& tank.x < blocos[b].x + blocos[b].width - ESPACO_COLISAO ) {
    				
    				tank.aceleracaoCima = 0;
    				tank.y = blocos[b].y + blocos[b].height;
    			}
    			
    			/**
    			 * Rob� colide com o bloco por cima (pisando).
    			 *  
    			 */
    			if ( tank.aceleracaoCima <= 0 && tank.y + tank.height > blocos[b].y 
    				&& tank.y + tank.height < blocos[b].y + blocos[b].height 
    				&& tank.y + tank.height - tank.aceleracaoBaixo - ESPACO_COLISAO < blocos[b].y 
    				&& tank.x + tank.width > blocos[b].x + ESPACO_COLISAO 
    				&& tank.x < blocos[b].x + blocos[b].width - ESPACO_COLISAO ) {
    				
    				tank.y = blocos[b].y - tank.height;
    				
    				tank.pulando = false;
    				
    				tank.aceleracaoBaixo = 0;
    			}
    			
    			/**
    			 * Rob� colide com o bloco pela direita.
    			 * 
    			 */
    			else if ( tank.x+tank.width > blocos[b].x && tank.x < blocos[b].x 
    				&& tank.y+tank.height > blocos[b].y + ESPACO_COLISAO
    				&& tank.y < blocos[b].y + blocos[b].height - ESPACO_COLISAO ) {
    				
    				tank.x = tank.x - (tank.x + tank.width - blocos[b].x);
    			}
    			
    			/**
    			 * Rob� colide com o bloco pela esquerda.
    			 *  
    			 */
    			else if ( tank.x < blocos[b].x + blocos[b].width && tank.x > blocos[b].x 
    				&& tank.y + tank.height > blocos[b].y + ESPACO_COLISAO 
    				&& tank.y < blocos[b].y + blocos[b].height - ESPACO_COLISAO) {
    				
    				tank.x = tank.x + (blocos[b].x + blocos[b].width - tank.x);
    			}
    			
    			
    			/*
    			 * Titan
    			 * 
    			 */
    			/**
    			 * Rob� colide com o bloco por baixo (cabeceando).
    			 *  
    			 */
    			if ( titan.y < blocos[b].y + blocos[b].height && titan.y > blocos[b].y 
    				&& titan.x + titan.width > blocos[b].x + ESPACO_COLISAO 
    				&& titan.x < blocos[b].x + blocos[b].width - ESPACO_COLISAO ) {
    				
    				titan.aceleracaoCima = 0;
    				titan.y = blocos[b].y + blocos[b].height;
    			}
    			
    			/**
    			 * Rob� colide com o bloco por cima (pisando).
    			 *  
    			 */
    			if ( titan.aceleracaoCima <= 0 && titan.y + titan.height > blocos[b].y 
    				&& titan.y + titan.height < blocos[b].y + blocos[b].height 
    				&& titan.y + titan.height - titan.aceleracaoBaixo - ESPACO_COLISAO < blocos[b].y 
    				&& titan.x + titan.width > blocos[b].x + ESPACO_COLISAO 
    				&& titan.x < blocos[b].x + blocos[b].width - ESPACO_COLISAO ) {
    				
    				titan.y = blocos[b].y - titan.height;
    				
    				titan.pulando = false;
    				
    				titan.aceleracaoBaixo = 0;
    			}
    			
    			/**
    			 * Rob� colide com o bloco pela direita.
    			 * 
    			 */
    			else if ( titan.x+titan.width > blocos[b].x && titan.x < blocos[b].x 
    				&& titan.y+titan.height > blocos[b].y + ESPACO_COLISAO
    				&& titan.y < blocos[b].y + blocos[b].height - ESPACO_COLISAO ) {
    				
    				titan.x = titan.x - (titan.x + titan.width - blocos[b].x);
    			}
    			
    			/**
    			 * Rob� colide com o bloco pela esquerda.
    			 *  
    			 */
    			else if ( titan.x < blocos[b].x + blocos[b].width && titan.x > blocos[b].x 
    				&& titan.y + titan.height > blocos[b].y + ESPACO_COLISAO 
    				&& titan.y < blocos[b].y + blocos[b].height - ESPACO_COLISAO) {
    				
    				titan.x = titan.x + (blocos[b].x + blocos[b].width - titan.x);
    			}
    		}
    	});

    	/**
    	 * Adiciona os objetos do jogo à cena principal.
    	 *  
    	 */
    	game.rootScene.addChild(ambiente);
    	game.rootScene.addChild(tank);
    	game.rootScene.addChild(titan);
    	
		/*
		 * Cria a plataforma de blocos que começa com o jogo.
		 * 
		 */
		criarPlataforma();
    };
    
    /**
     * Core.start()
     * 
     * Outras funções relacionadas: Core.pause() e Core.resume();
     * 
     */
    game.start();
};

/**
 * Funções do jogo.
 * 
 * Criadas para ajudar na manutenção de código e evitar duplicação.
 *  
 */

/**
 * Função usada para criar blocos de uma plataforma inicial, ao começar o jogo,
 * possibilitando os robôs caminharem sobre ela.
 *  
 */
function criarPlataforma() {

	addBloco(230, 320);
	
	for (var i = 230; i < 630; i++) {
		addBloco(i, 360);
	}
	
	addBloco(630, 320);
}

/**
 * Define o lugar (x,y) na grade onde um bloco será adicionado.
 *  
 */
function lugar(x, y) {
	
	var larguraTela = 800, larguraBloco = 40,
		alturaTela  = 600, alturaBloco  = 40,
		xProximo = 0, yProximo = 0;
		
	/**
	 * Buscando pelo x mais próximo. 
	 */
	for (var i = 0; i < (larguraTela/larguraBloco); i++) {
		
		if (x <= xProximo + larguraBloco) {
			break;
		}
		else {
			xProximo += larguraBloco;
		}
	}
	
	/**
	 * Buscando pelo y mais próximo.
	 *  
	 */
	for (var i = 0; i < (alturaTela/alturaBloco); i++) {
		if (y <= yProximo + alturaBloco) {
			break;
		}
		else {
			yProximo += alturaBloco;
		}
	}
	
	return { x: xProximo, y: yProximo };
}


/**
 * addBloco(x, y)
 * 
 * Adiciona um bloco à grade do jogo.
 *   
 * @param {Object} x posição x do bloco.
 * @param {Object} y posição y do bloco.
 */
function addBloco(x, y) {
	
	var bloco = new Sprite(40, 40);
	
	bloco.image = game.assets["/images/block.png"];
	
	var frame = [ Math.floor(Math.random() * 4) ];
	
	bloco.frame = [frame];

	var ponto = lugar(x, y);
	
	bloco.x = ponto.x, bloco.y = ponto.y;
	
	blocos.push(bloco);
	
	game.rootScene.addChild(bloco);
}

