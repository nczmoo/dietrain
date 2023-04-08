class Config {
    board = {
        height: 10,
        length: 10,
        
    }

    map = [];

    opposites = {
        down: 'up',
        left: 'right',
        right: 'left',
        up: 'down',
    };    
    numOfResources = 3;
    orientations = {
        c : ['ne', 'se', 'sw', 'nw'], // go from n-s to e-w
        s : ['ns', 'we'],
    };
    resources = [];
    score = 0;
    trackDirections = {
        ne: ['up', 'right'],
        ns: ['up', 'down'],
        nw: ['up', 'left'],
        se: ['down', 'right'],
        sw: ['down', 'left'],
        we: ['left', 'right'],
        
    }
    tracks = [];
    trains = {
        me: {dir: 'down', x: 0, y: 0},
        enemy: {dir: 'up', x: 9, y: 9},
    }
    // {owner: 'me', orientation: type: 'c'}

    constructor (){
        for (let x = 0; x < this.board.length; x++){
            this.map.push([]);
            for (let y = 0; y < this.board.height; y++){                
                this.map[x][y] = 0;
            }
        }
        this.map[0][0] = 2;
        this.map[9][9] = 2;
        for (let i = 0; i < this.numOfResources; i++){
            let x = randNum(2,7);
            let y = randNum(2,7);
            this.resources.push({x: x, y: y });
            this.map[x][y] = 3;
        }
        console.log(this.resources);
        this.createTrack('me', 'c', 'se', this.trains.me.x, this.trains.me.y);
        this.createTrack('enemy', 'c', 'nw', this.trains.enemy.x, this.trains.enemy.y);        
    }

    createTrack(owner, type, orientation, x, y){
        
        if (owner != 'me' && owner != 'enemy'){
            console.log ('owner');
            return;
        }

        if (type != 'c' && type != 's'){
            console.log ('type');
            return;
        }
        
        if (!this.orientations[type].includes(orientation)){
            console.log ('orientation');
            return;
        }

        if (x < 0 || x > this.length){
            console.log ('x');
            return;
        }

        if (y < 0 || y > this.height){
            console.log ('y');
            return;
        }
        
        this.tracks.push({ owner: owner, type: type, orientation: orientation, x: x, y: y });
        this.map[x][y] = 1;
    }
}