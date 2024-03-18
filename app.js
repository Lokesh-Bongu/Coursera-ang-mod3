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
        // Replace with your actual API endpoint URL
        var url = "https://your-api-endpoint.com/menu_items"; // Example placeholder
  
        return $http.get(url)
          .then(function(response) {
            if (response.data) {
              var filteredItems = [];
              // Assuming your API response is an array of objects:
              angular.forEach(response.data, function(item) {
                if (item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
                    item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                  filteredItems.push(item); // Add matching items to filteredItems array
                }
              });
              return filteredItems;
            } else {
              // Handle case where response.data is undefined (e.g., network error)
              console.log("Error fetching menu items");
              return [];
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
        }
      };
      return ddo;
    }
  
  })();
  