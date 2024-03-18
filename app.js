(function() {

    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('foundItems', foundItemsDirective);
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var narrowDown = this;
      narrowDown.searchTerm = ""; // Initialize searchTerm to an empty string
      narrowDown.found = [];
  
      narrowDown.getMenuItems = function() {
        MenuSearchService.getMatchedMenuItems()
          .then(function(response) {
            if (response.data) {
              var searchTerm = response.data.searchTerm.toLowerCase(); // Convert to lowercase after data is received
              // ... proceed with search logic using searchTerm
            } else {
              // Handle case where response.data is undefined
            }
          });
      };
  
      narrowDown.removeItem = function(index) {
        narrowDown.found.splice(index, 1);
      };
    }
  
    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
      this.getMatchedMenuItems = function() {
        var url = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"; // Assuming you have an API call here
        // Replace with your actual logic to fetch searchTerm and other data
        return $http.get(url)
          .then(function(response) {
            if (response.data) {
              return { searchTerm: response.data.searchTerm };  // Assuming searchTerm is a property within the response data
            } else {
              // Handle case where response.data is undefined
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
  