(function () {
    'use strict';
    
    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', foundItems);
    
    function NarrowItDownController($http, MenuSearchService) {
      var ctrl = this;
    
      ctrl.searchTerm = "";
      ctrl.found = [];
    
      ctrl.findItems = function () {
        MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
        .then(function (matchedItems) {
          ctrl.found = matchedItems;
        });
      };
    
      ctrl.removeItem = function (itemIndex) {
        ctrl.found.splice(itemIndex, 1);
      };
    }
    
    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
      this.getMatchedMenuItems = function (searchTerm) {
        return $http.get("https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json")
          .then(function (response) {
            var foundItems = [];
            var items = response.data;
    
            for (var i = 0; i < items.length; i++) {
              var description = items[i].description.toLowerCase();
              if (description.indexOf(searchTerm.toLowerCase()) !== -1) {
                foundItems.push(items[i]);
              }
            }
    
            return foundItems;
          });
      };
    }
    
    function foundItems() {
      return {
        restrict: 'E',
        scope: {
          items: '<'
        },
        templateUrl: 'foundItems.html',
        controller: function($scope) {
          $scope.removeItem = function(itemIndex) {
            $scope.$parent.removeItem(itemIndex);
          };
        }
      };
    }
    
    })();
    