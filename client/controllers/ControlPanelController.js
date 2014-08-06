
var ControlPanelController = function ($rootScope, $scope) {
    $scope.cordX = 3;
    $scope.cordY = 3;
    $scope.cordZ = 3;

    $scope.buttonClicked = function (clickEvent) {
        $rootScope.$emit(clickEvent.currentTarget.id);
    };
    $scope.insertClicked = function () {
        $rootScope.$emit('insertValue', parseInt($scope.cordX), parseInt($scope.cordY), parseInt($scope.cordZ));
    };
};
