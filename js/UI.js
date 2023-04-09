class UI{
	constructor(){

	}
	refresh(){
		let fillers = ['score'];
		ui.drawBoard();
		for (let fill of fillers){
			$("#" + fill).html(game.config[fill]);
		}		
		$("#maxScore").html(game.config.trains.me.health);
		for (let upgrade in game.config.upgrades){
			let cost = game.config.upgrades[upgrade];
			$("#" + upgrade).html(game.config.trains.me[upgrade])
			$("#upgrade-" + upgrade).html("&uarr;	 (-" + cost + ")");
			$("#upgrade-" + upgrade).prop('disabled', false);
			if (game.config.score < cost){
				$("#upgrade-" + upgrade).prop('disabled', true);
			}
		}
		
	}

	drawBoard(){
		let txt = '';
		for (let y = 0; y < game.config.board.height; y++){		
			txt += "<div class='h'>"			
			for (let x = 0; x < game.config.board.length; x++){	
				let boxContains = ' &nbsp; '
				let boxClass = ' empty ';				
				let track = game.isThereTrackHere(x, y);								
				let train = game.isTrainHere(x, y);
				if (track != null){
					boxContains = this.drawTrack(track.type, track. orientation, x, y);
					boxClass = ' ' + track.owner;
					
				}
				if (train != null){
					boxContains = this.drawTrain(train.dir);
				}
				if (game.config.map[x][y] == 3){
					boxContains = 'X';
				}
				txt += "<span id='board-" + x + "-" + y 
				+ "' class='box " + boxClass + "'>" + boxContains + "</span>";
			}
			txt += "</div>";
		}		
		$("#board").html(txt);
	}

	drawTrain(dir){
		let txt = "<img src='img/train.png' class='train-" + dir + "'>";
		return txt;
	}
	drawTrack(type, orientation, x, y){
		let txt = "<img src='img/track-" + type + ".png' id='track-" + x + "-" 
			+ y + "' class='track " + type + "-" + orientation + "'>"; //nw
		
		return txt;
	}

	showTrackPossibilities(x, y){
		let txt = "";
		let possibilties = game.fetchPossibilities(x, y, 'me');
		for (let orientation of game.config.orientations.s){
			if (!possibilties.includes(orientation)){
				continue;
			}
			txt += "<img src='img/track-s.png' id='placeTrack-" + x + "-" + y 
				+ "-" + orientation + "' class='me-3 s-" + orientation + " placeTrack'>";
		}
		for (let orientation of game.config.orientations.c){
			if (!possibilties.includes(orientation)){
				continue;
			}
			txt += "<img src='img/track-c.png' id='placeTrack-"  + x + "-" + y 
				+ "-" + orientation + "' class='c-" + orientation 
				+ " me-3 placeTrack' >";
		}		
		$("#under").html(txt);
	}
}
