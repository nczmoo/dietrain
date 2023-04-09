class Game{
	config = new Config();	
	gameLoop = null;
	constructor(){
		setInterval(this.looping, 1000);
	}
	areResourcesNear(trainID){
		let train = this.config.trains[trainID];
		for (let resource of this.config.resources){
			let distance = Math.round(Math.sqrt(Math.pow(train.x - resource.x, 2) + Math.pow(train.y - resource.y, 2)));
			if (trainID == 'me' && distance == 1){
				this.config.score ++;
			}			
		}		
	}

	checkTracksForDir(tracks, direction){
	
		for (let where in tracks){
			let track = tracks[where];
			if (track.orientation.includes(direction)){
				return true;
			}
		}
		return false;
	
	}

	enemyPlacesTrack(){
		let tries = 0;
		while (tries < 10){
			tries ++;
			let rand = this.fetchRandTrack(); // doesn't return track just id
			let track = this.config.tracks[rand];
			let empties = this.fetchAdjacentEmpties(track.x, track.y);
			if (empties.length < 1){
				console.log('not enough empties');
				continue;				
			}
			let randSpace = empties[randNum(0, empties.length - 1)];
			let possibilities = this.fetchPossibilities(randSpace.x, randSpace.y);
			if (possibilities.length < 1){
				console.log('not enough possiblities');
				continue;
			}

			let orientation = possibilities[randNum(0, possibilities.length - 1)];
			let type = 's';
			if (this.config.orientations.c.includes(orientation)){
				type = 'c';
			}
			this.config.createTrack('enemy', type, orientation, randSpace.x, randSpace.y)

			break;
		}
	}

	fetchAdjacentEmpties(x, y){
		let xDelta = {
			down: 0,
			left: -1,
			right: 1,
			up: 0,
		}
		let yDelta = {
			down: 1,
			left: 0,
			right: 0,
			up: -1,
		}
		let directions = this.config.trackDirections[this.fetchTrackAt(x, y).orientation];
		let empties = [];
		for (let direction of directions){
			let newX = x + xDelta[direction];
			let newY = y + yDelta[direction];
			if (this.config.map[newX][newY] == 0){
				empties.push({x: newX ,y: newY,});
			}
		}
		return empties;
		
	}

	fetchAdjacentTracks(x, y){
		let deltas = [-1, 1];
		let horizontal = ['left', 'right'];
		let vertical = ['up', 'down'];
		let tracks = {};		
		
		for (let i in deltas){						
			let delta = deltas[i];		
			if (x + delta >= 0 && x + delta < this.config.board.length 
				&& this.config.map[x + delta][y] != undefined 
				&& this.config.map[x + delta][y] == 1){
				tracks[horizontal[i]] = this.fetchTrackAt(x + delta, y);
			}
			if (y + delta >= 0 && y + delta < this.config.board.height 
				&& this.config.map[x][y + delta] != undefined 
				&& this.config.map[x][y + delta] == 1){
				tracks[vertical[i]] = this.fetchTrackAt(x, y + delta);
			}
		}
		return tracks;
	}

	fetchIncompatibles(x, y){
		let ban = [];
		if (x == 0){
			ban.push('w');
		} else if (x == this.config.board.length - 1){
			ban.push('e');
		}
		if (y == 0){
			ban.push('n');
		} else if (y == this.config.board.height - 1){
			ban.push('s');
		}
		return ban;
	}

	fetchPossibilities(x, y){
		let adjacents = this.fetchAdjacentTracks(x, y);
		// is there a track left or right
		let north = false, east = false, south = false, west = false;
		let possibilties = [];
		for (let where in adjacents){
			let track = adjacents[where];			
			if (track.orientation.includes('s') && where == 'up'){
				north = true;
			}			
			if (track.orientation.includes('w') && where == 'right'){
				east = true;
			}
			if (track.orientation.includes('n') && where == 'down'){
				south = true;
			}
			if (track.orientation.includes('e') && where == 'left'){
				west = true;
			}			
		}		
		if (east || west){
			possibilties.push ('we');
		} else if (north || south){
			possibilties.push ('ns');
		}
		for (let orientation of this.config.orientations.c){		
			if (
				(north && orientation.includes('n'))
				|| (east && orientation.includes('e'))
				|| (south && orientation.includes('s'))				
				|| (west && orientation.includes('w'))
			) {
				possibilties.push(orientation);
			}
			
		}
		
		return this.prune(possibilties, x, y);
	}

	fetchRandTrack(){ // jsut assuming it's an enemy;
		while (1){
			let rand = randNum(0, this.config.tracks.length - 1);
			let track = this.config.tracks[rand];
			if (track.owner == 'enemy'){
				return rand;
			}
		}
	}

	fetchTrackAt(x, y){
		for (let track of this.config.tracks){			
			if (track.x == x && track.y == y){		
				return track;
			}
		}
		return null;
	}
	isThereTrackHere(x, y){
		if (this.config.map[x][y] == 0){
			return null;
		}
		return this.fetchTrackAt(x, y);
		
	}

	isTrainHere(x, y){
		for (let i in this.config.trains){
			let train = this.config.trains[i];
			if (train.x == x && train.y == y){
				return train;
			}
		}
		return null;
	}

	looping(){
		for (let i in game.config.trains){
			game.areResourcesNear(i);
			let train = game.config.trains[i];
			let adjacents = game.fetchAdjacentTracks(train.x, train.y);
			let possDirections = game.config.trackDirections[game.fetchTrackAt(train.x, train.y).orientation];
			let isThereTrackAhead = Object.keys(adjacents).includes( train.dir);
			
			if (isThereTrackAhead){
				game.config.trains[i].x = adjacents[train.dir].x;
				game.config.trains[i].y = adjacents[train.dir].y;
				continue;
			} 

			//is there an open route besides behind me;
			let behind = game.config.opposites[train.dir];
			let alternate = possDirections[0];
			if (possDirections[0] == behind){
				alternate = possDirections[1];
			}
			if (train.dir == alternate){
				game.config.trains[i].dir = behind;
				continue;
			}
			game.config.trains[i].dir = alternate;
		}
		ui.refresh();
	}

	placeTrack(x, y, track){	
		let type = 'c';
		if (this.config.orientations.s.includes(track)){
			type = 's';
		}
		this.config.createTrack('me', type, track, x, y);
		ui.refresh();		
		$("#under").html('');
		this.enemyPlacesTrack();
	}

	prune(possibilities, x, y){
		let avoid = this.fetchIncompatibles(x, y);		
		for (let id in possibilities){
			let possibility = possibilities[id];
			for (let i of avoid){
				if (possibility.includes(i)){
					possibilities.splice(id);
				}
			}
		}		
		return possibilities;
	}

	removeTrack(x, y){
		if (this.isTrainHere(x, y)){
			return;
		}
		this.config.map[x][y] = 0;
		for (let i in this.config.tracks){
			let track = this.config.tracks[i];
			if (track.x == x && track.y == y){
				this.config.tracks.splice(i);
			}
		}
	}

	turnAround(trainID){		
		let train = this.config.trains[trainID];
		let track = this.fetchTrackAt (train.x, train.y);
		let directions = this.config.trackDirections[track.orientation];


		/*
		if (directions[0] == train.dir){
			this.config.trains[trainID].dir = directions[1];
			return;
		}
		this.config.trains[trainID].dir = directions[0];
		*/
	}


	upgrade(type){
		if (this.config.score < this.upgrades[type]){
			return;
		}
		this.config.score -= this.upgrades[type];
		this.upgrades[type] *= 1.5;
		if (type == health){
			this.config.health *= 1.1;			
			return;
		}
		this.config[type] ++;
	}
}
