
var ControlPanelController = function ($rootScope, $scope) {
    $scope.buttonClicked = function (clickEvent) {
        $rootScope.$emit(clickEvent.currentTarget.id);
    };
};
