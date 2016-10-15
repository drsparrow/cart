$(function(){

  var $container = $('.js-sheet-music')
  for(var i = 1; i< 20; i++) {
    $img = $('<img src="media/sheet_music/'+i+'.jpg">')
    $container.append($img)
  }
})
