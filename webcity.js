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
 	jsc.init();
	setTimeout("jsc.update()", jsc.core.day_length);
});
/**
 * This object contains all the data in use by the program.
 */
jsc = {}; // Initialise Core jsc object
// Initialise JSC subobjects
/**
 * Core data. Most of these are set once.
 */
jsc.core = {};
/** 
 * The clock. Used to store timekeeping data and functions
 */
jsc.clock = {};
/**
 * Updateable data. This is used to keep track of data in use by multiple tools and processes.
 */
jsc.data = {};

/**
 * Stores user changable game settings.
 */
jsc.settings = {};
/**
 * Core game function for starting a new game
 */
jsc.init = function() {
	
	jsc.core.paused = false;
	jsc.core.day_length = 2500;
	jsc.core.grid_size = 200;
	
	jsc.data.cash = 10000;
	jsc.data.citizens = 0;
	jsc.data.jobs = 0;
	
	jsc.data.currentTool = null;
	
	jsc.clock.day = 1;
	jsc.clock.month = 1;
	jsc.clock.year = 1900;
	jsc.clock.daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
	
	jsc.settings.currency = "$";
	
	// Initialise cells to null
	jsc.data.cells = [];
	for(var x = 0; x < jsc.core.grid_size; x++) {
		jsc.data.cells[x] = [];
		for(var y = 0; y < jsc.core.grid_size; y++) {
			jsc.data.cells[x][y] = {type: null, developed: false, powered: false, watered: false, hasTransport: false, wealth: 0, quality: 0};
		}
	}
}
/**
 * Core updating function. Runs different update functions in a loop.
 */
jsc.update = function() {
	if(!jsc.core.paused) {
		jsc.clock.update();
		if(jsc.clock.day == 1) { // First week run budget
			jsc.core.doBudget();
		}
		if (jsc.clock.day % 7 == 0) {
			for(var process in jsc.processes) {
				jsc.processes[process].run();
			}
		}
		jsc.ui.update();
	}
	setTimeout(jsc.update, jsc.core.day_length);
};
jsc.core.doBudget = function() {
	return false; // TODO implement
};
/**
 * Generates a random number.
 */
jsc.core.getRand = function() {
	return Math.floor(Math.random() * 100);
};
/**
 * Updates a property in a certain radius of the current cell.
 * @param {Number} squares The maximum distance of cells to update
 * @param {String} prop The property to change
 * @param {Object} value The value to set
 */
jsc.core.updatePropAroundSelection = function(squares, prop, value) {
	var scanStartX = jsc.data.selection.startX - squares;
	if(scanStartX < 0) {
		scanStartX = 0;
	}
	var scanStartY = jsc.data.selection.startY - squares;
	if(scanStartY < 0) {
		scanStartY = 0;
	}
	var scanEndX = jsc.data.selection.endX + squares;
	if(scanEndX > 199) {
		scanEndX = 199;
	}
	var scanEndY = jsc.data.selection.endY + squares;
	if(scanEndY > 199) {
		scanEndY = 199;
	}
	
	for(x = scanStartX; x <= scanEndX; x++) {
		for(y = scanStartY; y <= scanEndY; y++) {
			jsc.data.cells[x][y][prop] = value;
		}
	}
};
/**
 *  Updates game clock
 */
jsc.clock.update = function() {
	jsc.clock.day++;
	if(jsc.clock.day > jsc.clock.daysInMonth[jsc.clock.month - 1]) {
		jsc.clock.day = 1;
		jsc.clock.month++;
		if(jsc.clock.month >= 12) { 
			jsc.clock.month = 1;
			jsc.clock.year++;
		}
	}
};
/**
 * Gets the co-ordinates as an array for an object.
 * @param {String} id The cells id (in the format cx-y)
 */
jsc.core.coordsFromId = function(id) {
	var coord_array = id.split("-");
	coord_array[0] = coord_array[0].replace("c", "");
	return coord_array;
};
/**
 * Prepares a selection to be looped by reversing X or Y axis as neccesary
 * @param {Object} selection The selection to prepare. For the current selection, use jsc.data.selection
 */
jsc.core.prepareSelection = function(selection) {
	var end_selection =  {startX: selection.startX, endX: selection.endX, startY: selection.startY, endY: selection.endY };
	if(end_selection.startX > end_selection.endX) {
		var tempX = end_selection.endX;
		end_selection.endX = end_selection.startX;
		end_selection.startX = tempX;
	}
	if(end_selection.startY > end_selection.endY) {
		var tempY = end_selection.endY;
		end_selection.endY = end_selection.startY;
		end_selection.startY = tempY;
	}
	return end_selection;
}
/**
 * Pauses the game
 */
jsc.core.pause = function() {
	jsc.core.paused = !jsc.core.paused;
};
/**
 * Save function. Currently unfinished
 */
jsc.core.save = function() {
	json = $.toJSON(jsc.data.cells);
	alert(json);
};
/**
 * Changes the amount of cash in the treasury.
 * @param {Number} amount The amount to change by. Positive to give money, negative to take money
 * @param {Boolean} show_at_cursor Whether the amount charged should be shown floating by the cursor.
 */
jsc.core.changeCash = function(amount, show_at_cursor) {
	show_at_cursor = show_at_cursor || false;
	jsc.data.cash += amount;
	if(show_at_cursor) {
		jsc.ui.showCashChange(amount);
	}
};
/**
 * This function gets the current development level of the cell.
 * 
 * @param {Number} x The x co-ordinate of the cell.
 * @param {Number} y The y co-ordinate of the cell
 * 
 * @return {Number} 0 if undeveloped, 1 if zoned, 2 if developed zone or 3 if road or 4 if city building.
 */
jsc.core.getDevelopmentLevel = function(x, y) {
	if(jsc.data.cells[x][y].type == null) {
		return 0;
	}
	var base_level = jsc.toolData[jsc.data.cells[x][y].type].developmentLevel;
	if(base_level == 1 && jsc.data.cells[x][y].developed) {
		base_level = 2;
	}
	return base_level;
};