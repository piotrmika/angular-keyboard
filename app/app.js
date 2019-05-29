angular.module('mshotel', [])
    .controller('MainController', function($scope) {
       $scope.test = "";
        $scope.test2 = "";
    })
.directive('mskey', function() {
   return {
       restrict: 'A',
       replace : false,
       scope : {
           elemId : "@",
           ngModel : "=",
           mskey : "="
       },
       template : '<div id="kbrBox"><style type="text/css">.keyboard{background-color: dimgrey;} .btn-lg {margin: 3px; font-size: 30px; padding: 14px 21px;}</style>',
       controller : function($scope, $element, $compile) {

           $scope.kbType = $element[0].getAttribute('mskey');
           if ($scope.kbType == undefined) $scope.kbType = 'multi';

           $scope.large = false;
           $scope.click = false;
           $scope.plChars = false;

           function makeid(length) {
               var text = "";
               var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

               for (var i = 0; i < length; i++)
                   text += possible.charAt(Math.floor(Math.random() * possible.length));

               return text;
           }

           $scope.elemId = 'keyboard' + makeid(7);

           $(document).bind('click', function(event){
               $scope.click = true;
               if (event.target.classList[2] == "btn-kbrd") return;
               var isClickedElementChildOfPopup = $element
                       .find(event.target)
                       .length > 0;

               $scope.$apply(function(){
                   if (event.target == $element[0])
                       $scope.openKyboard(); else
                       $scope.hideKeyboard();
               });
           });

           $scope.hideKeyboard = function() {
               var key = document.getElementById($scope.elemId);
               key.style.display = 'none';
           };

           $scope.openKyboard = function() {
               var key = document.getElementById($scope.elemId);
               key.style.display = 'block';
               key.style.position = 'absolute';
               key.style.top = ($element.prop('offsetTop') + 25) + 'px';
               var isOut = isOutOfViewport(key);

               if (isOut.right) key.style.right = '0px'
           };

           var isOutOfViewport = function (elem) {
               var bounding = elem.getBoundingClientRect();

               var out = {};
               out.top = bounding.top < 0;
               out.left = bounding.left < 0;
               out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
               out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
               out.any = out.top || out.left || out.bottom || out.right;
               out.all = out.top && out.left && out.bottom && out.right;

               return out;
           };

           function addKey(key, plChars, theSame) {
               var str = ''; class_disabled = plChars && theSame ? 'disabled' : '';
               str = '<button class="btn btn-default btn-kbrd btn-lg ' + class_disabled + '"  ng-click="setKey(\'' + key + '\')">' + key + '</button>';
               return str;
           }

           $scope.setKey = function(key) {
               switch (key) {
                   case 'space':
                       key = ' ';
                       $scope.large = false;
                       $scope.plChars = false;
                       break;
                   case 'Shift' :
                       $scope.large = !$scope.large;
                       key = '';
                       break;
                   case 'alt' :
                       $scope.plChars = !$scope.plChars;
                       key = '';
                       break;
                   case '<--' :
                       key = '';
                       $scope.ngModel = $scope.ngModel.substring(0, $scope.ngModel.length-1);
                       $scope.large = false;
                       $scope.plChars = false;
                       break;
                   default:
                       $scope.large = false;
                       $scope.plChars = false;
                       break;
               }
               $scope.ngModel += key;

           };

           $scope.$watch('large', function() {
               if ($scope.click)
                $scope.generateKeyboard();
           });

           $scope.$watch('plChars', function() {
               if ($scope.click)
                   $scope.generateKeyboard();
           });

           var tab = [
               ['q','w','e','r','t','y','u','i','o','p','<--'],
               ['a','s','d','f','g','h','j','k','l'],
               ['Shift','z','x','c','v','b','n','m',',','.'],
               ['alt', '@','space','%']
               ];
           var tabNum = [
               ['1','2', '3'],
               ['4', '5', '6'],
               ['7', '8', '9'],
               ['0']
           ];

           $scope.generateKeyboard = function() {

               var width = "1000";
               if ($scope.kbType == 'qwerty') width = "800";
               if ($scope.kbType == 'numeric') width = "300";

               var elem = document.getElementById($scope.elemId);
               var show = false;
               if (elem != null) {
                   elem.remove();
                   show = true;
               }
               var kvb = "";
               kvb += '<div class="card text-center keyboard" id="' + $scope.elemId + '" style="display: none; width: ' + width + 'px; padding: 15px; z-index: 10000;">';
               kvb += '<div class="row">';
               if ($scope.kbType == 'multi' || $scope.kbType == 'qwerty') {
                   //qwerty
                   kvb += $scope.kbType == 'qwerty' ? '<div class="col-md-12">' : '<div class="col-md-9">';
                   angular.forEach(tab, function(item) {
                       kvb += '<div class="row">';
                       angular.forEach(item, function(key) {
                           switch (key) {
                               case 'space':
                                   kvb += '<button class="btn btn-default btn-kbrd btn-lg"  ng-click="setKey(\'' + key + '\')">' +
                                       '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                                       + key +
                                       '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                                       '</button>';
                                   break;
                               case 'Shift':
                                   kvb += addKey(key);
                                   break;
                               case 'alt':
                                   kvb += addKey(key);
                                   break;
                               default:
                                   if ($scope.large) key = key.toUpperCase();
                                   var keyTmp = key;
                                   if ($scope.plChars) {
                                       if (key == 'a') key = 'ą';
                                       if (key == 'A') key = 'Ą';
                                       if (key == 'e') key = 'ę';
                                       if (key == 'E') key = 'Ę';
                                       if (key == 'l') key = 'ł';
                                       if (key == 'L') key = 'Ł';
                                       if (key == 'z') key = 'ż';
                                       if (key == 'Z') key = 'Ż';
                                       if (key == 'X') key = 'Ź';
                                       if (key == 'x') key = 'ź';
                                       if (key == 'C') key = 'Ć';
                                       if (key == 'c') key = 'ć';
                                       if (key == 'o') key = 'ó';
                                       if (key == 'O') key = 'Ó';
                                       if (key == 'N') key = 'Ń';
                                       if (key == 'n') key = 'ń';
                                       if (key == 's') key = 'ś';
                                       if (key == 'S') key = 'Ś';
                                   }
                                   kvb += addKey(key, $scope.plChars, keyTmp == key);
                                   break;
                           }

                       });
                       kvb += '</div>';
                   });

                   kvb += '</div>';
               }
               if ($scope.kbType == 'multi' || $scope.kbType == 'numeric') {
                   //alphanumeric
                   kvb += $scope.kbType == 'numeric' ? '<div class="col-md-12">' : '<div class="col-md-3">';
                   angular.forEach(tabNum, function(item) {
                       kvb += '<div class="row">';
                       angular.forEach(item, function(key) {
                           switch (key) {
                               case 'space':
                                   kvb += '<button class="btn btn-default btn-kbrd btn-lg"  ng-click="setKey(\'' + key + '\')">' +
                                       '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                                       + key +
                                       '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                                       '</button>';
                                   break;
                               case 'Shift':
                                   kvb += addKey(key);
                                   break;
                               case 'alt':
                                   kvb += addKey(key);
                                   break;
                               default:
                                   kvb += addKey(key, null, null);
                                   break;
                           }

                       });
                       kvb += '</div>';
                   });

                   kvb += '</div>';
               }


               kvb += '</div>';
               kvb += '</div>';

               $element.parent().append($compile(kvb)($scope));
               if (show) $scope.openKyboard();
           }

           $scope.generateKeyboard();


       }
   }
});