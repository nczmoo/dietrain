$(document).on('click', '', function(e){

})

$(document).on('click', '.verb1', function(e){
	game[e.target.id.split('-')[0]](e.target.id.split('-')[1]);
});

$(document).on('click', '.empty', function(e){
	console.log('empty');
	ui.showTrackPossibilities(Number(e.target.id.split('-')[1]), Number(e.target.id.split('-')[2]));
});

$(document).on('click', '.track', function(e){
	game.removeTrack(e.target.id.split('-')[1], e.target.id.split('-')[2]);
});

$(document).on('click', '.placeTrack', function(e){
	game.placeTrack(Number(e.target.id.split('-')[1]), Number(e.target.id.split('-')[2]), e.target.id.split('-')[3])
})

$(document).on('click', 'button', function(e){
	ui.refresh()
})
