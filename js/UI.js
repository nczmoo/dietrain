class UI{
	constructor(){

	}
	refresh(){
		ui.drawBoard();
	}

	drawBoard(){
		let txt = '';
		for (let y = 0; y < game.config.board.height; y++){		
			txt += "<div class='h'>"			
			for (let x = 0; x < game.config.board.length; x++){	
				let boxContains = ' &nbsp; '
				let boxClass = '';
				let track = game.isThereTrackHere(x, y);								
				let train = game.isTrainHere(x, y);
				if (track != null){
					boxContains = this.drawTrack(track.type, track. orientation);
					boxClass = ' ' + track.owner;
					
				}
				if (train != null){
					boxContains = this.drawTrain(train.dir);
				}
				txt += "<span id='board-" + x + "-" + y 
				+ "' class='box " + boxClass + "'>" + boxContains + "</span>";
			}
			txt += "</div>";
		}		
		$("#board").html(txt);
	}

	drawTrain(dir){
		console.log(dir);
		let txt = "<img src='img/train.png' class='train-" + dir + "'>";
		return txt;
	}
	drawTrack(type, orientation){
		console.log(type, orientation)
		let txt = "<img src='img/track-" + type + ".png' class='" + type + "-" + orientation + "'>"; //nw
		
		return txt;
	}

	showTrackPossibilities(x, y){
		let txt = "";
		let possibilties = game.fetchPossibilities(x, y);
		console.log(possibilties);
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
