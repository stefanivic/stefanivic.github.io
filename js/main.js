var prev = 0;
var $window = $(window);
var nav = $('.navigation');

$window.on('scroll', function(){
  var scrollTop = $window.scrollTop();
  nav.toggleClass('navigation-hidden', scrollTop > prev);
  prev = scrollTop;
});