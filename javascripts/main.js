/* global console: false, confirm: false, angular: false, $: false */

'use strict';

// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false);

var app = angular.module('myApp', []);

/* Key up event */

app.directive('onKeyupFn', function() {
    return function(scope, elm, attrs) {
        //Evaluate the variable that was passed
        //In this case we're just passing a variable that points
        //to a function we'll call each keyup
        var keyupFn = scope.$eval(attrs.onKeyupFn);
        elm.bind('keyup', function(evt) {
            //$apply makes sure that angular knows 
            //we're changing something
            scope.$apply(function() {
                keyupFn.call(scope, evt.which);
            });
        });
    };
});

/* Focus and blur events */

app.directive('ngFocus', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngFocus']);
    element.bind('focus', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  };
}]);
 
app.directive('ngBlur', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngBlur']);
    element.bind('blur', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  };
}]);

var CONTENT_BACKUP=[{name:'html',description:'Beginners start here! The very basics of putting something on a webpage',$then:['css','javascript','angular','php'],home:'http://developer.mozilla.org/en-US/docs/Web/HTML',links:[{name:'Codeacademy',url:'http://www.codecademy.com/courses/web-beginner-en-HZA3b/0/1?curriculum_id=50579fb998b470000202dc8b'},{name:'HTML Dog',url:'http://htmldog.com/guides/html/beginner/'},{name:'HTML5 Doctor',url:'http://html5doctor.com/'},{name:'Dash',url:'https://dash.generalassemb.ly/projects'},
{name:'Treehouse',url:'http://teamtreehouse.com/library'}]},{name:'css',description:'Styling your webpage',$then:['javascript','less','sass','bootstrap'],home:'http://developer.mozilla.org/en-US/docs/Web/CSS',links:[{name:'Codeacademy',url:'http://www.codecademy.com/courses/web-beginner-en-TlhFi/0/1?curriculum_id=50579fb998b470000202dc8b'}]}];

function masterCtrl($scope, $window, $http, $timeout, $location, $anchorScroll, $document) {

  $scope.donate_progress = Math.round(217.4*100/2083.33);

  $scope.current_box = null;

  $scope.next_boxes = null;

  $scope.use_hash = function() {
    if ($window.location.hash) {
      var hash = $window.location.hash.toLowerCase().replace(/[^a-zA-Z0-9]/g,'');
      var box = $scope.boxes.findAll({name: hash})[0];
      if (box) $scope.set_next_boxes(box);
      $location.hash(hash);
      $anchorScroll();
      console.log('Jump to: '+hash);
    }
  };

  $scope.showInactiveBoxes = true;

  $scope.toggleInactiveBoxes = function() {
    $scope.showInactiveBoxes = !$scope.showInactiveBoxes;
  };

  $scope.toggleAction = function() {
    return ($scope.showInactiveBoxes) ? 'Hide' : 'Show';
  };

  $scope.set_previous_boxes = function() {
    $scope.set_next_boxes($scope.previous_box, $scope.previous_index);
  };

  // Show what the next boxes are
  $scope.set_next_boxes = function($box, $index) {
    if ($scope.current_box === null || $box != $scope.current_box) {
      $scope.current_box = $box;
      $scope.next_boxes = $box.$then;
      if ($index != $scope.more_index) $scope.more_index = null;
    } else {
      $scope.current_box = null;
      $scope.next_boxes = null;
    }
  };

  $scope.in_next_boxes = function($name) {
    if ($scope.current_box === null) return true;
    if ($name == $scope.current_box.name) return 'current';
    return ($scope.current_box === null || $scope.next_boxes.indexOf($name) > -1);
  };

  $scope.welcome = true;
  $scope.next_steps = true;

  $scope.load_boxes = function() {
    $scope.boxes = CONTENT_BACKUP;
    // Remove fallback
    // Fallback message
    $timeout(function() { $('#message').css('display', 'block'); }, 750);
    $.getJSON('content.json', function(data) {
      $scope.boxes = data;
      $scope.working = true;
      $scope.welcome = false;
      $scope.next_steps = false;
      $timeout(function() { $('#donate').hide().slideDown('normal'); }, 13000);
    });
  }();

  $scope.load_sponsors = function() {
    // Remove fallback
    /* JSON mime type */
    $.getJSON('sponsors.json', function(data) {
      $scope.sponsors = data;
      $scope.sponsors.other.sort();
      $scope.sponsors.desired.sort();
    });
  }();

  $scope.tiers_hidden = true;

  $scope.show_sponsorship = function() {
    if ($scope.tiers_hidden) {
      $('#sponsorship_tiers').hide().removeClass('hidden').slideDown('normal');
      if ($('#max_amount').val() !== true) $('#max_amount').val('10');
    }
    $scope.tiers_hidden = false;
  };

  $scope.set_sponsorship = function($amount) {
    $('#max_amount').val($amount);
  };

  $scope.fire_sponsorship = function() {
    if ($('#max_amount').val().length === 0) $('#max_amount').val('10');
    $('#sponsorship').submit();
  };

  $scope.more_index = null;

  $scope.show_more = function($index) {
    $scope.more_index = $index;
  };

}