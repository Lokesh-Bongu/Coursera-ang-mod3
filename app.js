(function () {
    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('menuItems',MenuItemsDirective) // Directive renamed to menuItems
      .constant('ApiBasePath', 'https://coursera-jhu-default-rtdb.firebaseio.com');
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var narrowDown = this;
      narrowDown.searchTerm = '';
      narrowDown.found = [];
      narrowDown.searchButtonClicked = false;
  
      narrowDown.search = function () {
        narrowDown.searchButtonClicked = true;
  
        if (narrowDown.searchTerm.trim() === '') {
          narrowDown.found = [];
          return;
        }
  
        MenuSearchService.getMatchedMenuItems(narrowDown.searchTerm)
          .then(function (foundItems) {
            narrowDown.found = foundItems;
          })
          .catch(function (error) {
            console.error('Error fetching data:', error);
            narrowDown.found = [];
          });
      };
  
      narrowDown.removeItem = function (index) {
        narrowDown.found.splice(index, 1);
      };
    }
  
    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
      var service = this;
  
      service.getMatchedMenuItems = function (searchTerm) {
        return $http({
          method: "GET",
          url: (ApiBasePath + "/menu_items.json")
        }).then(function (result) {
          if (!result || !result.data || !result.data.menu_items) {
            return []; // Return an empty array if the response is not as expected
          }
          var foundItems = result.data.menu_items.filter(function (item) {
            return item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
          });
          return foundItems;
        }).catch(function(error) {
          console.error('Error fetching data:', error);
          return []; // Return an empty array in case of error
        });
      };
    }
  
    function MenuItemsDirective() { // Directive definition with new name
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