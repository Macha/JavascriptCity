/*
 *  Javascript City
 *
 *  Copyright (C) 2009 Macha <macha.hack@gmail.com>
 *
 *  This file is part of Javascript City (JSC).
 *
 *  JSC is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  JSC is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with JSC.  If not, see <http://www.gnu.org/licenses/>.
 */
$(document).ready(function() {
	for(var tool in jsc.tools) {
		jsc.tools[tool].init();
	}
});
/**
 * Used to store the tool's functions.
 */ 
jsc.tools = {};
/**
 * Used to store the data used by tools. Each tool should have a sub property assigned to it.
 */ 
jsc.toolData = {};

/**
 * The residential tools for housing zones.
 */
jsc.tools.res = {};
/**
 * Initialises the residential tool for use.
 */
jsc.tools.res.init = function() {
	jsc.toolData.res = {};
	jsc.toolData.res.developmentLevel = 1;
	jsc.toolData.res.cost = 15;
	jsc.toolData.res.removeCost = 10;
	jsc.toolData.res.image = "images/res.png";
};
/**
 * Runs the residential tool on the current selection (jsc.data.selection)
 */
jsc.tools.res.run = function() {
	for(var x = jsc.data.selection.startX; x <= jsc.data.selection.endX; x++) {
		if(jsc.data.cash < jsc.toolData.res.cost) {
			break;
		}
		for(var y = jsc.data.selection.startY; y <= jsc.data.selection.endY; y++) {
			if(jsc.data.cash < jsc.toolData.res.cost) {
				break;
			}
			if(jsc.core.getDevelopmentLevel(x, y) > jsc.toolData.res.developmentLevel) {
				continue;
			}
			if(jsc.data.cells[x][y].type != null) {
				jsc.tools[jsc.data.cells[x][y].type].remove(x, y);
			}
			jsc.data.cells[x][y].type = "res";
			jsc.data.cash -= jsc.toolData.res.cost;
			jsc.ui.addClassToCell("res", x, y);
			jsc.ui.clearSelection();
		}
	}
};
/**
 * Removes residential zone from a cell.
 * @param {Number} x The x co-ordinate of the cell.
 * @param {Number} y The y co-ordinate of the cell
 */
jsc.tools.res.remove = function(x, y) {
	if(jsc.data.cells[x][y].developed) {
		jsc.data.cash -= jsc.toolData.res.removeCost;
	}
	jsc.data.cells[x][y].type = null;
	jsc.data.cells[x][y].developed = false;
	jsc.ui.removeClassFromCell("res developed", x, y);
};
/**
 * The industrial tools for factory zones.
 */
jsc.tools.ind = {};
/**
 * Initialises the industrial tool for use.
 */
jsc.tools.ind.init = function() {
	jsc.toolData.ind = {};
	jsc.toolData.ind.developmentLevel = 1;
	jsc.toolData.ind.cost = 20;
	jsc.toolData.ind.removeCost = 15;
	jsc.toolData.ind.image = "images/ind.png";
};
/**
 * Runs the industrial tool on the current selection (jsc.data.selection)
 */
jsc.tools.ind.run = function() {
	for(var x = jsc.data.selection.startX; x <= jsc.data.selection.endX; x++) {
		if(jsc.data.cash < jsc.toolData.ind.cost) {
			break;
		}
		for(var y = jsc.data.selection.startY; y <= jsc.data.selection.endY; y++) {
			if(jsc.data.cash < jsc.toolData.ind.cost) {
				break;
			}
			if(jsc.core.getDevelopmentLevel(x, y) > jsc.toolData.ind.developmentLevel) {
				continue;
			}
			if(jsc.data.cells[x][y].type != null) {
				jsc.tools[jsc.data.cells[x][y].type].remove(x, y);
			}
			jsc.data.cells[x][y].type = "ind";
			jsc.core.changeCash(-jsc.toolData.ind.cost);
			jsc.ui.addClassToCell("ind", x, y);
			jsc.ui.clearSelection();
		}
	}
};
/**
 * Removes industrial zone from a cell.
 * @param {Number} x The x co-ordinate of the cell.
 * @param {Number} y The y co-ordinate of the cell
 */
jsc.tools.ind.remove = function(x, y) {
	if(jsc.data.cells[x][y].developed) {
		jsc.data.cash -= jsc.toolData.ind.removeCost;
	}
	jsc.data.cells[x][y].type = null;
	jsc.data.cells[x][y].developed = false;
	jsc.ui.removeClassFromCell("ind developed", x, y);
};
jsc.tools.com = {};
jsc.tools.com.run = function() {
	for(var x = jsc.data.selection.startX; x <= jsc.data.selection.endX; x++) {
		if(jsc.data.cash < jsc.toolData.com.cost) {
			break;
		}
		for(var y = jsc.data.selection.startY; y <= jsc.data.selection.endY; y++) {
			if(jsc.data.cash < jsc.toolData.com.cost) {
				break;
			}
			if(jsc.core.getDevelopmentLevel(x, y) > jsc.toolData.com.developmentLevel) {
				continue;
			}
			if(jsc.data.cells[x][y].type != null) {
				jsc.tools[jsc.data.cells[x][y].type].remove(x, y);
			}
			jsc.data.cells[x][y].type = "com";
			jsc.data.cash -= jsc.toolData.com.cost;
			jsc.ui.addClassToCell("com", x, y);
			jsc.ui.clearSelection();
		}
	}
};
jsc.tools.com.init = function() {
	jsc.toolData.com = {};
	jsc.toolData.com.developmentLevel = 1;
	jsc.toolData.com.cost = 20;
	jsc.toolData.com.removeCost = 12;
	jsc.toolData.com.image = "images/com.png";
};
jsc.tools.com.remove = function(x, y) {
	if(jsc.data.cells[x][y].developed) {
		jsc.data.cash -= jsc.toolData.com.removeCost;
	}
	jsc.data.cells[x][y].type = null;
	jsc.data.cells[x][y].developed = false;
	jsc.ui.removeClassFromCell("com developed", x, y);
};

jsc.tools.road = {};
jsc.tools.road.init = function() {
	jsc.toolData.road = {};
	jsc.toolData.road.developmentLevel = 3;
	jsc.toolData.road.cost = 3;
	jsc.toolData.road.removeCost = 4;
	jsc.toolData.road.image = "images/road.png";
};
jsc.tools.road.run = function() {
	for(var x = jsc.data.selection.startX; x <= jsc.data.selection.endX; x++) {
		if(jsc.data.cash < jsc.toolData.road.cost) {
			break;
		}
		for(var y = jsc.data.selection.startY; y <= jsc.data.selection.endY; y++) {
			if(jsc.data.cash < jsc.toolData.road.cost) {
				break;
			}
			if(jsc.core.getDevelopmentLevel(x, y) > jsc.toolData.road.developmentLevel) {
				continue;
			}
			if(jsc.data.cells[x][y].type != null) {
				jsc.tools[jsc.data.cells[x][y].type].remove(x, y);
			}
			jsc.data.cells[x][y].type = "road";
			jsc.data.cash -= jsc.toolData.road.cost;
			jsc.ui.addClassToCell("road", x, y);
		}
	}
	jsc.tools.road.correctType();
	jsc.ui.clearSelection();
	jsc.core.updatePropAroundSelection(3, "hasTransport", true);
};
jsc.tools.road.correctType = function() {
	var selection = jsc.core.prepareSelection(jsc.data.selection);
	
	firstX = (selection.startX > 0) ? selection.startX - 1 : selection.startX;
	lastX = (selection.endX < 199) ? selection.endX + 1 : selection.endX;
	firstY = (selection.startY > 0) ? selection.startY - 1 : selection.startY;
	lastY = (selection.endY < 199) ? selection.endY + 1 : selection.endY;

	
	
	for(var x = firstX; x <= lastX; x++) { // Uses x declared above
		for(var y = firstY; y <= lastY; y++) {
			if(
				(jsc.data.cells[x-1] == undefined || jsc.data.cells[x-1][y].type != "road" )
				&& 
				(jsc.data.cells[x+1] == undefined || jsc.data.cells[x+1][y].type != "road" )
				&& 
				jsc.data.cells[x][y].type == "road"
			) {
				jsc.ui.addClassToCell("horz", x, y);
			}
			else {
				jsc.ui.removeClassFromCell("horz", x, y);
			}
			if(
				(jsc.data.cells[x][y-1] == undefined || jsc.data.cells[x][y-1].type != "road")
				&& 
				(jsc.data.cells[x][y+1] == undefined || jsc.data.cells[x][y+1].type != "road")
				&& 
				jsc.data.cells[x][y].type == "road"
			) {
				jsc.ui.addClassToCell("vert", x, y);
			}
			else {
				jsc.ui.removeClassFromCell("vert", x, y);
			}
		}
	}
};
jsc.tools.road.remove = function(x, y) {
	jsc.data.cash -= jsc.toolData.road.removeCost;
	jsc.data.cells[x][y].type = null;
	jsc.data.cells[x][y].developed = false;
	jsc.ui.removeClassFromCell("road", x, y);
};
jsc.tools.coal = {};
jsc.tools.coal.init = function() {
	jsc.toolData.coal = {};
	jsc.toolData.coal.developmentLevel = 4;
	jsc.toolData.coal.cost = 100;
	jsc.toolData.coal.removeCost = 40;
	jsc.toolData.coal.powerAmount = 1000;
	jsc.toolData.coal.image = "images/coal-power.png";
};
jsc.tools.coal.run = function() {
	var selection = jsc.core.prepareSelection(jsc.data.selection);
	var locX = selection.startX;
	var locY = selection.startY;

	if(jsc.core.getDevelopmentLevel(locX, locY) < jsc.toolData.coal.developmentLevel) {
		jsc.data.cells[locX][locY].type = "coal";
		jsc.data.cash -= jsc.toolData.coal.cost;
		jsc.ui.addClassToCell("coal", locX, locY);
		
		jsc.data.powerSources.push({totalPower: jsc.toolData.coal.powerAmount, usedPower: 0, x: locX, y: locY});
	}
};
jsc.tools.coal.remove = function(x, y) {
	jsc.data.cash -= jsc.toolData.coal.removeCost;
	jsc.data.cells[x][y].type = null;
	jsc.data.cells[x][y].developed = false;
	jsc.ui.removeClassFromCell("coal", x, y);
};
jsc.tools.query = {};
jsc.tools.query.init = function() {
	jsc.toolData.query = {};
	jsc.toolData.query.image = "images/query.png";
};
jsc.tools.query.run = function() {
	var selection = jsc.core.prepareSelection(jsc.data.selection);
	var x = selection.startX;
	var y = selection.startY;
	
	alert("Powered: " + jsc.data.cells[x][y].powered);
};
jsc.tools.query.remove = function() {};