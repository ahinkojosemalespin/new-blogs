var app = angular.module('myApp', []);

function tagsCtrl($scope, $http) {

    $scope.tags = [];
    //Object for saving the new tag
 	$scope.dataTag = {};

    //Load tags
    $scope.loadTags = function() {
        var httpRequest = $http({
            method: 'get',
            url: '/tags/get',
            dataType: 'json',
        }).success(function (data, status) {
            console.log(data);
            $scope.tags = data;
        });
    };

    //Create new tag
    $scope.createTag = function() {
        var httpRequest = $http({
            method: 'post',
            url: '/tags/new',
            data: { texttag: $scope.dataTag.texttag,
            		urltag: $scope.dataTag.urltag,},
        }).success(function(data, status) {
            console.log(data);               
            if(data){
                alert("Tag saved successfully!");
                $("#closeNewTag").click();
                //The fields become empty
                $("#txtTextTag").val("");
                $("#txtUrlTag").val("");
                //Reload the tags list
                $scope.loadTags();

            }
        });
    };
}

$(function(){
    //Set the navigation bar to Tag
    $(".nav").children("li").removeClass("active");
    $(".nav").children("li").eq(1).addClass("active"); 
});