import * as angular from "angular";

import "angular-ui-router";
import "angular-cookies";
import "angular-animate";

import routesConfig from "./routes";

import "./index.less";

import MainAppController from "./app/MainAppController";
import GameManager from "./app/game/GameManager";
import GridService from "./app/grid/GridService"; 
import KeyboardService from "./app/keyboard/KeyboardService"; 
import TileModel from "./app/grid/TileModel";
import GenerateUniqueId from "./app/game/GenerateUniqueId";
import gridDirective from "./app/grid/gridDirective";
import tileDirective from "./app/grid/tileDirective";
export const app: string = "app";

export default angular
  .module(app, ["ui.router", "ngCookies", "ngAnimate"])
  .config(routesConfig)
  .directive('grid', gridDirective)
  .directive('tile',tileDirective)
  .service("GameManager", GameManager)
  .service("GridService", GridService)
  .service("KeyboardService", KeyboardService)
  .factory("TileModel", TileModel)
  .factory("GenerateUniqueId", GenerateUniqueId)
  .controller("MainAppController", MainAppController);
