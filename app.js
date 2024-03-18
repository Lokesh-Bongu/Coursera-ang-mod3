(function () {
    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('menuItems', MenuItemsDirective)
      .constant('ApiBasePath', 'https://coursera-jhu-default-rtdb.firebaseio.com');
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var narrowDown = this;
      narrowDown.searchTerm = '';
      narrowDown.found = [];
      narrowDown.searchButtonClicked = false;
      narrowDown.showLoader = false; // Flag to control loader visibility
  
      narrowDown.search = function () {
        narrowDown.searchButtonClicked = true;
        narrowDown.showLoader = true; // Show loader while fetching data
  
        if (narrowDown.searchTerm.trim() === '') {
          narrowDown.found = [];
          narrowDown.showLoader = false; // Hide loader if search term is empty
          return;
        }
  
        MenuSearchService.getMatchedMenuItems(narrowDown.searchTerm)
          .then(function (foundItems) {
            narrowDown.found = foundItems;
            narrowDown.showLoader = false; // Hide loader after receiving data
            console.log("Found Items:", foundItems); // Log found items
          })
          .catch(function (error) {
            console.error('Error fetching data:', error);
            narrowDown.found = [];
            narrowDown.showLoader = false; // Hide loader in case of error
          });
      };
  
      narrowDown.removeItem = function (index) {
        narrowDown.found.splice(index, 1);
      };
    }
  
    function getMatchedMenuItems(searchTerm) {
      console.log("Search Term:", searchTerm); // Log search term
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function (result) {
        if (!result || !result.data || !result.data.menu_items) {
          return []; // Return an empty array if the response is not as expected
        }
        var lowercaseSearchTerm = searchTerm.toLowerCase();
        var foundItems = result.data.menu_items.filter(function (item) {
          console.log("Item Description:", item.description); // Log item description
          var lowercaseDescription = item.description.toLowerCase();
          return lowercaseDescription.indexOf(lowercaseSearchTerm) !== -1;
        });
        console.log("Found Items after filtering:", foundItems); // Log found items after filtering
        return foundItems;
      }).catch(function(error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array in case of error
      });
    }
  
    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
      var service = this;
  
      service.getMatchedMenuItems = getMatchedMenuItems;
    }
  
    function MenuItemsDirective() {
      var ddo = {
        templateUrl: 'foundItems.html',
        scope: {
          foundItems: '<',
          onRemove: '&'
        },
        controller: FoundItemsDirectiveController,
        controllerAs: 'list',
        bindToController: true
      };
      return ddo;
    }
  
    function FoundItemsDirectiveController() {
      var list = this;
    }
  
  })();
  