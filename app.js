(function() {

    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('foundItems', foundItemsDirective);
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var narrowDown = this;
      narrowDown.searchTerm = ""; // Initialize to an empty string
      narrowDown.found = [];
  
      narrowDown.getMenuItems = function() {
        if (narrowDown.searchTerm) { // Check if searchTerm has a value
          MenuSearchService.getMatchedMenuItems(narrowDown.searchTerm)
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
        var url = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"; // Replace with your actual API endpoint
  
        // Assuming your API response contains a property named 'searchTerm'
        return $http.get(url)
          .then(function(response) {
            if (response.data) {
              var searchTermFromResponse = response.data.searchTerm; // Access searchTerm from your API response structure
              if (searchTermFromResponse) {
                return { searchTerm: searchTermFromResponse.toLowerCase() }; // Convert to lowercase here
              } else {
                // Handle case where searchTerm is missing in the response
                console.log("searchTerm not found in API response");
                return {};
              }
            } else {
              // Handle case where response.data is undefined (e.g., network error)
              console.log("Error fetching menu items");
              return {};
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
  