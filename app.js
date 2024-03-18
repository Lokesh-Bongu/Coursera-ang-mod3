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
        if (narrowDown.searchTerm) { // Check if searchTerm has a value
          searchTerm = narrowDown.searchTerm.toLowerCase(); // Convert search term to lowercase
          MenuSearchService.getMatchedMenuItems(searchTerm)
            .then(function(matchedItems) {
              narrowDown.found = matchedItems;
            });
        } else {
          // Handle case where searchTerm is empty
          console.log("Please enter a search term");
        }
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
            if (response.data) {  // Check if response.data has a value
              var foundItems = [];
              for (var item in response.data) {
                // Convert description to lowercase for case-insensitive search
                response.data[item].description = response.data[item].description.toLowerCase();
                if (response.data[item].description.indexOf(searchTerm) !== -1) {
                  foundItems.push(response.data[item]);
                }
              }
              return foundItems;
            } else {
              // Handle case where response.data is undefined
              return []; // Or throw an error
            }
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
  