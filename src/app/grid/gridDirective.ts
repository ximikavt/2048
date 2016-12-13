let myTemplate: string = require("./grid.tpl.html");

export default function GridDirective() {
    return {
        restrict: 'A',
        scope: { 
            model: '='
        },
        templateUrl: myTemplate,
        link: (scope) => {
            scope.$watch(() => {
                return scope.model
            }, (n) => {
                console.log(n);
            });
        }
    };
}
