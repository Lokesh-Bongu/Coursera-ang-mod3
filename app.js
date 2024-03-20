(function() {

    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService);
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var narrowDown = this;
      narrowDown.searchTerm = "";
      narrowDown.found = [];
  
      narrowDown.getMenuItems = function() {
        if (narrowDown.searchTerm) {
          MenuSearchService.getMatchedMenuItems(narrowDown.searchTerm)
            .then(function(matchedItems) {
              narrowDown.found = matchedItems;
            });
        } else {
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
        var url = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json";
  
        return $http.get(url)
          .then(function(response) {
            if (response.data) {
              var filteredItems = [];
              // Loop through each category (A and B)
              for (var category in response.data) {
                // Access the menu items array for the current category
                var items = response.data[category].menu_items;
                console.log("items",items)
                // Loop through each menu item in the current category
                for (var i = 0; i < items.length; i++) {
                  var item = items[i];
                  var searchTerm = searchTerm.toLowerCase(); // Convert search term to lowercase for case-insensitive matching
                  console.log("searchTerm",searchTerm)
                  if (item.description.toLowerCase().indexOf(searchTerm) !== -1 ||
                      item.name.toLowerCase().indexOf(searchTerm) !== -1) {
                    filteredItems.push(item); // Add matching items to filteredItems array
                  }
                }
              }
              return filteredItems;
            } else {
              console.log("Error fetching menu items");
              return [];
            }
          });
      };
    }
  
  })();
  