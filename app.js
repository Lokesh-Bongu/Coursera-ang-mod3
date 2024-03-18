(function() {

    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('foundItems', foundItemsDirective);
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var narrowDown = this;
      narrowDown.searchTerm = "";
      narrowDown.found = [];
  
      narrowDown.getMenuItems = function() {
        MenuSearchService.getMatchedMenuItems(narrowDown.searchTerm)
          .then(function(matchedItems) {
            narrowDown.found = matchedItems;
          });
      };
  
      narrowDown.removeItem = function(index) {
        narrowDown.found.splice(index, 1);
      };
    }
  
    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
      this.getMatchedMenuItems = function(searchTerm) {
        var url = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json";
        return $http.get(url)
          .then(function(response) {
            var foundItems = [];
            for (var item in response.data) {
              if (response.data[item].description.indexOf(searchTerm) !== -1) {
                foundItems.push(response.data[item]);
              }
            }
            return foundItems;
          });
      };
    }
  
    function foundItemsDirective() {
      var ddo = {
        restrict: 'E',
        templateUrl: 'foundItems.html',
        scope: {
          found: '='
        },
        controller: function($scope) {
          $scope.removeItem = function(index) {
            $scope.$parent.narrowDown.removeItem(index);
          };
        },
        bindToController: {
          onRemove: '&'
        }
      };
      return ddo;
    }
  
  })();
  