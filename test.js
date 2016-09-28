$(function(){

  var Carter = function(domObject){
    this.jqueryObject = $(domObject)
    this.width = this.jqueryObject.width()
    this.height = this.jqueryObject.height()
    this.perimeter = this.width + this.height
    this.seed = Math.random()
    Carter.carters.push(this)
  }

  Carter.carters = []

  Carter.last = function () {
    var arr = Carter.carters;
    return arr[arr.length - 1];
  }

  Carter.removeLast = function () {
    var carter = Carter.carters.pop()
    if(!carter) { return }
    carter.jqueryObject.remove();
  }

  Carter.prototype.left = function () { return this.jqueryObject.position().left }
  Carter.prototype.top = function () { return this.jqueryObject.position().top }
  Carter.prototype.centerX = function () { return this.left() + this.width/2 }
  Carter.prototype.centerY = function () { return this.top() + this.height/2 }

  Carter.prototype.move = function() {
    if(!this.canMove()) { return }
    this.jqueryObject.css('left', this.left() + this.compareX())
    this.jqueryObject.css('top', this.top() + this.compareY())
  }

  Carter.prototype.react = function () {
    this.resize();
    if(x && y) { this.move(); }
  };

  Carter.prototype.resize = function () {
    var d = new Date();
    var n = d.getMilliseconds();
    var change = Math.sin((n/1000)*(2*Math.PI) + this.seed)
    this.jqueryObject.width(this.width + 4*change)
    this.jqueryObject.height(this.height + 4*change)
  }

  Carter.prototype.canMove = function () {
    var carters = Carter.carters
    for(var i = 0; i < carters.length; i++){
      var other = carters[i]
      if (other.perimeter < this.perimeter) {
        if (this.overlappingSmaller(other)) { return false  }
      }
    }
    return true
  };

  Carter.prototype.overlappingSmaller = function(other) {
    return (Math.abs(other.centerX() - this.centerX()) < other.width/2 &&
            Math.abs(other.centerY() - this.centerY()) < other.height/2)
  }

  Carter.prototype.compareX = function() {
    var diff = this.left() + this.width/2 - x
    if (Math.abs(diff) < this.width/2) { return 0 }
    var dir = ((diff < 0) ? 1 : -1)
    this.maybeFlip(dir)
    return this.distanceFromDir(dir)
  }

  Carter.prototype.compareY = function() {
    var diff = this.top() + this.height/2 - y
    if (Math.abs(diff) < this.height/2) { return 0 }
    var dir = ((diff < 0) ? 1 : -1)
    return this.distanceFromDir(dir)
  }

  Carter.prototype.maybeFlip = function (dir) {
    if (dir == 1) {
      this.jqueryObject.addClass('flipped')
    } else {
      this.jqueryObject.removeClass('flipped')
    }
  }

  Carter.prototype.distanceFromDir = function(dir) {
    return (dir + dir*400/this.perimeter)/2
  }

  var x, y;
  var $followers = $('.follower')
  $followers.each(function() { new Carter(this) })

  var moveFunction = function() {
    Carter.carters.forEach(function(f) { f.react() })
  }

  var $addition = $('.js-addition')
  var $removal = $('.js-removal')
  var pictureIndex = 0
  var totalPictures = 3
  var flopped = false

  $addition.click(function(){
    $removal.show()
    var prevSize = Carter.last() ? Carter.last().width : 380
    var size = Carter.last() ? Carter.last().width * 3/4 : 380
    if(size <= 20) { $addition.hide(); return }
    var $newCarter = $('<img class="follower" src="js-image/cart'+pictureIndex+'.png">')
    if (flopped) { $newCarter.addClass('flopped') }
    $newCarter.width(size)
    $newCarter.height(size)

    $('.content').append($newCarter)
    new Carter($newCarter)
  })

  $('.js-removal').click(function(){
    $addition.show()
    Carter.removeLast()
    if (!Carter.carters.length) { $removal.hide() }
  })

  $('.content').mousemove(function(e){
    offset = $('.content').offset()
    x = e.clientX - offset.left + $(document).scrollLeft()
    y = e.clientY - offset.top + $(document).scrollTop()
  })

  $('.js-change').click(function(){
    pictureIndex = (pictureIndex + 1)%totalPictures
    $('img.follower').attr('src', "js-image/cart"+pictureIndex+".png")
  })

  $('.js-flop').click(function(){
    flopped = !flopped
    if (flopped) {
      $('img.follower').addClass('flopped')
    } else {
      $('img.follower').removeClass('flopped')
    }
  })

  setInterval(moveFunction, 10)
})
