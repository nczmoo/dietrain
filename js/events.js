$(document).on('click', '', function(e){

})

$(document).on('click', '.box', function(e){
	ui.showTrackPossibilities(Number(e.target.id.split('-')[1]), Number(e.target.id.split('-')[2]));
});

$(document).on('click', '.placeTrack', function(e){
	game.placeTrack(Number(e.target.id.split('-')[1]), Number(e.target.id.split('-')[2]), e.target.id.split('-')[3])
})

$(document).on('click', 'button', function(e){
	ui.refresh()
})
