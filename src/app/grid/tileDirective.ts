let myTemplate: string = require("./tile.tpl.html");

export default function TileDirective() {
    return {
        restrict: 'A',
        scope: {
            model: '='
        },
        templateUrl: myTemplate, 
        link: (scope) => {
        }
    };
}
