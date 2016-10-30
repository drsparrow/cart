$(function(){
  // needed for safari
  $('span.img-wrapper img').load(function(){ $('span.img-wrapper').width(0) })

  // load tracking img after page fully loaded
  setTimeout(function() { $('body').append('<img src="http://ari.host/images/carterfunkhouser-website" class="hidden-img">') }, 1000)
})
