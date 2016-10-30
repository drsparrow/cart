$(function(){

  var Carter = function(domObject){
    this.jqueryObject = $(domObject)
    this.width = this.jqueryObject.width()
    this.height = this.jqueryObject.height()
    this.perimeter = this.width + this.height
    this.seed = Math.random()
    Carter.carters.push(this)
  }

  Carter.multiplier = 2
  Carter.carters = []

  Carter.last = function () {
    var arr = Carter.carters;
    return arr[arr.length - 1];
  }

  Carter.moveAll = function () {
    Carter.carters.forEach(function(cart) { cart.react() })
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
    if(mouseX && mouseY) { this.move(); }
  };

  Carter.prototype.resize = function () {
    var d = new Date();
    var n = d.getMilliseconds();
    var change = Math.sin((n/1000)*(2*Math.PI) + this.seed)
    var changeTo = this.width + (change * Math.pow(Carter.multiplier,2))
    this.jqueryObject.width(changeTo)
    this.jqueryObject.height(changeTo)
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
    var diff = this.left() + this.width/2 - mouseX
    if (Math.abs(diff) < this.width/2) { return 0 }
    var dir = ((diff < 0) ? 1 : -1)
    this.maybeFlip(dir)
    return this.distanceFromDir(dir)
  }

  Carter.prototype.compareY = function() {
    var diff = this.top() + this.height/2 - mouseY
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

  var mouseX, mouseY;
  var $followers = $('.follower')
  $followers.each(function() { new Carter(this) })

  var $addition = $('.js-addition')
  var pictureIndex = 0
  var totalPictures = 5
  var flopped = false
  var $carterHeadsContent = $('.carter-heads-content')

  $addition.click(function(){
    var prevSize = Carter.last() ? Carter.last().width : 380
    var size = Carter.last() ? Carter.last().width * 3/4 : 380
    if(size <= 20) {
      $addition.addClass('disabled')
      if (!Carter.brokenFree) { $('.js-remove-border').show()}
      return
    }
    var $newCarter = $('<img class="follower" src="js-image/cart'+pictureIndex+'.png">')
    if (flopped) { $newCarter.addClass('flopped') }
    $newCarter.width(size)
    $newCarter.height(size)

    $carterHeadsContent.append($newCarter)
    new Carter($newCarter)
  })

  $(document).mousemove(function(e){
    if(!$carterHeadsContent.is(':hover') && !Carter.brokenFree) { return }
    var offset = $carterHeadsContent.offset()
    mouseX = e.clientX - offset.left + $(document).scrollLeft()
    mouseY = e.clientY - offset.top + $(document).scrollTop()
  })

  $('.js-change').click(function(){
    $('.js-addition').show()
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

  $('.js-multiplier').on('input', function(){
    Carter.multiplier = this.value
  })

  $('.js-remove-border').click(function(){
    Carter.brokenFree = true
    $carterHeadsContent.css('border-color', 'transparent')
    $(this).addClass('disabled')
  })

  setInterval(Carter.moveAll, 10)

})
