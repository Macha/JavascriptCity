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
	// Drag and Drop code (for toolbox, etc.)
	jsc.ui.dragging = false;
	jsc.ui.dragElement = null;
	jsc.ui.jqcache = {};
	
	jsc.ui.toolFollower = $("#tool-follower");
	jsc.ui.overlay = $("#overlay");
	
	$("#tools td").click(function(e) {
		e.stopImmediatePropagation() 
		var tool = $(this).attr("id");
		if(jsc.data.currentTool != tool) {
			jsc.data.currentTool = tool;
			jsc.ui.toolFollower.css("background-image", "url(" + jsc.toolData[tool].image + ")");
		} else {
			jsc.data.currentTool = null;
			jsc.ui.toolFollower.css("background-image", "none");
		}
	});
	
	$(".drag-target").mousedown(function(e) {
		jsc.ui.dragElement =  $(this);
		jsc.ui.dragging = true;
		jsc.ui.offsetX = $(this).attr("offsetLeft") - e.clientX;
		jsc.ui.offsetY = $(this).attr("offsetTop") - e.clientY;
		jsc.ui.overlay.show(); // Overlay stops text beneath being selected. TODO Stop current elements text being selected.
	});
	$("html").mousemove(function(e) {
		if(jsc.ui.dragging) {
			jsc.ui.dragElement.css({"position": "absolute", "top": e.clientY + jsc.ui.offsetY, "left": e.clientX  + jsc.ui.offsetX, "z-index": "98"}); 
		}
		jsc.ui.toolFollower.css({"z-index": "99", "top": e.clientY + 20, "left": e.clientX + 20});
	});
	$(".drag-target").mouseup(function() {
		if(jsc.ui.dragging) {
			jsc.ui.dragging = false;
			jsc.ui.dragElement.css("z-index", "97");
			jsc.ui.overlay.hide();
		}
	});
	
	// Code for managing the status bar.
	$("#body table").mouseover(function(e) {
		var coord_array = jsc.core.coordsFromId($(e.target).attr("id"));
		$("#co-ords").html("X:" + coord_array[0] + " Y:" + coord_array[1]);
		var cellX = parseInt(coord_array[0], 10);
		var cellY = parseInt(coord_array[1], 10);
		jsc.ui.lastMouseOver = { x: cellX, y: cellY};
	});

	// Code for handling selections.
	jsc.data.selection = {startX: -1, startY: -1, endX: -1, endY: -1};
	jsc.ui.selectStep = 1;
	$("#body table").mousedown(function(e) {
		var coord_array = jsc.core.coordsFromId($(e.target).attr("id"));
		var x = parseInt(coord_array[0], 10);
		var y = parseInt(coord_array[1], 10);
		
		jsc.data.selection.startX = x;
		jsc.data.selection.startY = y;
		
		jsc.data.selection.endX = x;
		jsc.data.selection.endY = y;
		
		jsc.ui.selectStep = 2;
		jsc.ui.redrawSelection();
	});
	$("#body table").mouseover(function() {
		if(jsc.ui.selectStep == 2) {
			jsc.data.selection.endX = jsc.ui.lastMouseOver.x;
			jsc.data.selection.endY = jsc.ui.lastMouseOver.y;
			
			jsc.ui.redrawSelection();
		}
	});
	$("#body table").mouseup(function() {
		jsc.ui.selectStep = 1;
		jsc.data.selection = jsc.core.prepareSelection(jsc.data.selection);
		if(jsc.data.currentTool != null) {
			jsc.tools[jsc.data.currentTool].run();
		}
	});
	
	
	// Save and load.
	$("#save").click(function() {
		jsc.core.save();
	});
	$("#pause").click(function() {
		jsc.core.pause();
	});
});
/**
 * Caches calls to $(). Use instead of $() on all selectors with unchanging results.
 * @param {Object} selector The jQuery selector to use
 */ 
$c = function(selector) {
	if(!jsc.ui.jqcache[selector]) {
		jsc.ui.jqcache[selector] = $(selector);
	}
	return jsc.ui.jqcache[selector];
};

/**
 * The core object for all UI related code.
 */
jsc.ui = {};
/**
 * Updates various UI elements.
 */
jsc.ui.update = function() {
	$c("#cash").html(jsc.settings.currency + "" + jsc.data.cash);
	$c("#time").html("" + jsc.clock.day + "/" + jsc.clock.month + "/" + jsc.clock.year);
	$c("#pop").html(jsc.data.citizens);
	$c("#RCI-R").html(jsc.data.resDemand);
	$c("#RCI-C").html(jsc.data.comDemand);
	$c("#RCI-I").html(jsc.data.indDemand);
};
/**
 * Redraws the selection. Uses jsc.data.selection
 */
jsc.ui.redrawSelection = function() {
	var selection = jsc.core.prepareSelection(jsc.data.selection);
	jsc.ui.clearSelection();
	for(var x = selection.startX; x <= selection.endX; x++) {
		for(var y = selection.startY; y <= selection.endY; y++) {
			jsc.ui.addClassToCell("selected", x, y);
		}
	}
};
/**
 * Clears the visual selection
 */
jsc.ui.clearSelection = function() {
	$(".selected").removeClass("selected");
};
/**
 * Adds a class to a cell
 * @param {String} classToAdd The class to add
 * @param {Number} x The x co-ordinate of the cell
 * @param {Number} y The y co-ordinate of the cell
 */
jsc.ui.addClassToCell = function(classToAdd, x, y) {
	$c("#c" + x + "-" + y).addClass(classToAdd);
};
/**
 * Removes a class from a cell
 * @param {String} classToRemove The class to remove
 * @param {Number} x The x co-ordinate of the cell
 * @param {Number} y The y co-ordinate of the cell
 */
jsc.ui.removeClassFromCell = function(classToRemove, x, y) {
	$c("#c" + x + "-" + y).removeClass(classToRemove);
};
jsc.ui.showCashChange = function(amount) {
	if(amount < 0) {
		var color = "red";
	} else {
		var color = "green";
	}
	$c("#cash-cursor").html(jsc.settings.currency + "" + amount).css("color", color).show().fadeOut(10000);
};