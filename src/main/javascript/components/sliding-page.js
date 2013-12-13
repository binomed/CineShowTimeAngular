components.directive('slidingPage', ['ModelFactory', '$rootScope','$location'
  ,function (model, $rootScope,$location) {
   var directiveDefinitionObject = {
    restrict: 'A',
    scope: {        
    },    
    link: function postLink($scope, iElement, iAttrs) { 

      var animationFrame = Modernizr.prefixed('requestAnimationFrame', window);
      var pane_width = screen.width;
      var pane_count = 3;
      var current_pane = 0;

      var container = $(iElement[0]);
      container.width(pane_width * pane_count);
      iElement.find('li').css('width', pane_width+'px');

     /**
       * show pane by index
       */
      var showPane = function(index, animate) {
        console.log('ShowPane : '+index);
          // between the bounds
          index = Math.max(0, Math.min(index, pane_count-1));
          current_pane = index;

          var offset = -((100/pane_count)*current_pane);
          setContainerOffset(offset, animate);
      };


      function setContainerOffset(percent, animate) {
          container.removeClass("animate");

          if(animate) {
              container.addClass("animate");
          }

          if(Modernizr.csstransforms3d) {
              container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
          }
          else if(Modernizr.csstransforms) {
              container.css("transform", "translate("+ percent +"%,0)");
          }
          else {
              var px = ((pane_width*pane_count) / 100) * percent;
              container.css("left", px+"px");
          }
      }

      var nextPane = function() { 
        $rootScope.$emit('newPaneIndex', current_pane+1);
        return showPane(current_pane+1, true); 
      };
      var prevPane = function() { 
        $rootScope.$emit('newPaneIndex', current_pane-1);
        return showPane(current_pane-1, true); 
      };
      var lastX = 0;

      $rootScope.$on('newPaneClick', function(evt, index){
        current_pane = index;
        return showPane(current_pane, true); 
      });



      function handleHammer(ev) {
          console.log(ev.type+" : ");
          console.log(ev);
          // disable browser scrolling
          /*if (ev.gesture){
            ev.gesture.preventDefault();
          }else{
            ev.preventDefault();

          }*/

          switch(ev.type) {
              case 'drag':
              case 'dragright':
              case 'dragleft':
                  // stick to the finger
                  var pane_offset = -(100/pane_count)*current_pane;
                  var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

                  // slow down at the first and last pane
                  if((current_pane == 0 && ev.gesture.direction == "right") ||
                      (current_pane == pane_count-1 && ev.gesture.direction == "left")) {
                      drag_offset *= .4;
                  }

                  setContainerOffset(drag_offset + pane_offset);
                  break;

              case 'swipeleft':
                  nextPane();
                  ev.gesture.stopDetect();
                  break;

              case 'swiperight':
                  prevPane();
                  ev.gesture.stopDetect();
                  break;

              case 'release':
                  // more then 50% moved, navigate
                  if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
                      if(ev.gesture.direction == 'right') {
                          prevPane();
                      } else {
                          nextPane();
                      }
                  }
                  else {
                      showPane(current_pane, true);
                  }
                  break;
          }
      }


      //container.hammer({drag_lock_to_axis: true}).on('release drag dragleft dragright swipeleft swiperight', handleHammer);
      Hammer(container[0],{drag_lock_to_axis: true}).on('release drag dragend dragleft dragright swipeleft swiperight', handleHammer);
      /*var hammertime = new Hammer(container[0], { drag_lock_to_axis: true });
      $(container[0]).on("release dragleft dragright swipeleft swiperight", handleHammer);*/

      /*$('.movie-desc h2').hammer().on('drag release dragleft dragright swipeleft swiperight', function(evt){
        console.log("H2 log : "+evt.type);
        evt.gesture.preventDefault();
      });*/

     
    }
  };
  return directiveDefinitionObject;
}]);

 