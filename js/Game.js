class Game{
	config = new Config();
	constructor(){

	}
	checkTracksForDir(tracks, direction){
	
		for (let where in tracks){
			let track = tracks[where];
			console.log(where, track);
			if (track.orientation.includes(direction)){
				return true;
			}
		}
		return false;
	
	}

	fetchAdjacentTracks(x, y){
		let deltas = [-1, 1];
		let horizontal = ['left', 'right'];
		let vertical = ['up', 'down'];
		let tracks = {};		
		
		for (let i in deltas){						
			let delta = deltas[i];		
			//console.log(x, x + delta);
			/*
			console.log(x + delta >= 0, x + delta < this.config.board.length, 
				this.config.map[x + delta][y] != undefined,
				this.config.map[x + delta][y] != 0)	;
				*/
			if (x + delta >= 0 && x + delta < this.config.board.length 
				&& this.config.map[x + delta][y] != undefined 
				&& this.config.map[x + delta][y] != 0){
				tracks[horizontal[i]] = this.fetchTrackAt(x + delta, y);
			}
			if (y + delta >= 0 && y + delta < this.config.board.height 
				&& this.config.map[x][y + delta] != undefined 
				&& this.config.map[x][y + delta] != 0){
				tracks[vertical[i]] = this.fetchTrackAt(x, y + delta);
			}
		}
		return tracks;
	}

	fetchPossibilities(x, y){
		let adjacents = this.fetchAdjacentTracks(x, y);
		console.log(adjacents);
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
		return possibilties;
	}

	fetchTrackAt(x, y){
		console.log(x, y);
		for (let track of this.config.tracks){			
			console.log(track);
			if (track.x == x && track.y == y){		
				console.log(x, y);
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

	placeTrack(x, y, track){
		console.log(x, y, track);
		let type = 'c';
		if (this.config.orientations.s.includes(track)){
			type = 's';
		}
		this.config.createTrack('me', type, track, x, y);
		ui.refresh();
		console.log(this.config.tracks, this.config.maps);
	}


}
