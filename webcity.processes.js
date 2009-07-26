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
	for(var process in jsc.processes) {
		jsc.processes[process].init();
	}
});
jsc.processes = {};
jsc.processData = {};

jsc.processes.tax = {};
jsc.processes.tax.init = function() {};
jsc.processes.tax.run = function() {
	for(var x=0; x < jsc.core.grid_size; x++) {
		for (var y=0; y<jsc.core.grid_size; y++) {
			if(
				(jsc.data.cells[x][y].type == "res" || jsc.data.cells[x][y].type == "com" || jsc.data.cells[x][y].type == "ind") &&
				jsc.data.cells[x][y].developed
			) {
				jsc.data.cash++;
			}
		}
	}
};

jsc.processes.develop = {};
jsc.processes.develop.init = function() {
	jsc.processData.develop = {};
	jsc.data.resDemand = 10;
	jsc.data.comDemand = 8;
	jsc.data.indDemand = 5;
};
jsc.processes.develop.run = function() {
	for(var x=0; x < jsc.core.grid_size; x++) {
		for (var y=0; y<jsc.core.grid_size; y++) {
			if(!jsc.data.cells[x][y].developed) {
				
				var num = jsc.core.getRand();
				if(!jsc.data.cells[x][y].hasTransport) {
					num += 10;
				}
				if(!jsc.data.cells[x][y].powered) {
					num += 10;
				}
				
				
				if(jsc.data.cells[x][y].type == "res" && num < jsc.data.resDemand) {
					jsc.data.cells[x][y].developed = true;
					jsc.data.citizens += 10;
					jsc.ui.addClassToCell("developed", x, y);
				} else if(jsc.data.cells[x][y].type == "com" && num < jsc.data.comDemand) {
					jsc.data.cells[x][y].developed = true;
					jsc.data.jobs += 3;
					jsc.ui.addClassToCell("developed", x, y);
				} else if(jsc.data.cells[x][y].type == "ind"&& num < jsc.data.indDemand) {
					jsc.data.jobs += 10;
					jsc.data.cells[x][y].developed = true;
					jsc.ui.addClassToCell("developed", x, y);
				}
				
				
			}
		}
	}
};
jsc.processes.jobRatio = {};
jsc.processes.jobRatio.init = function() {};
jsc.processes.jobRatio.run = function() {
	if(jsc.data.jobs > jsc.data.citizens) {
		jsc.data.resDemand += 2;
		jsc.data.comDemand -= 1;
		jsc.data.indDemand -= 2;
	} else if(jsc.data.citizens > jsc.data.jobs) {
		jsc.data.resDemand -= 2;
		jsc.data.comDemand += 1;
		jsc.data.indDemand += 2;
	}
};
jsc.processes.power = {};
jsc.processes.power.init = function() {
	jsc.processData.power = {};
	/**
	 * All the power sources on the map.
	 */
	jsc.data.powerSources = [];
	/**
	 * The current calculations record of powered or not.
	 */
	jsc.processData.power.grid = [];
	/**
	 * Record of calculated cells
	 */
	jsc.processData.power.processed = [];
	
	jsc.processData.power.usagePerTile = 10;
	for(var x = 0; x < jsc.core.grid_size; x++) {
		jsc.processData.power.grid[x] = [];
		jsc.processData.power.processed[x] = [];
		for(var y = 0; y < jsc.core.grid_size; y++) {
			jsc.processData.power.grid[x][y] = false;
			jsc.processData.power.processed[x][y] = false;
		}
	}
};
jsc.processes.power.run = function() {
	for(var source in jsc.data.powerSources) {
		jsc.data.powerSources[source].usedPower = 0;
		jsc.processes.power.spread(jsc.data.powerSources[source], jsc.data.powerSources[source].x, jsc.data.powerSources[source].y);
	}
	for(var x = 0; x < jsc.core.grid_size; x++) {
		for(var y = 0; y < jsc.core.grid_size; y++) {
			jsc.data.cells[x][y].powered = jsc.processData.power.grid[x][y];
			jsc.processData.power.grid[x][y] = false;
			jsc.processData.power.processed[x][y] = false;
		}
	}
};
jsc.processes.power.spread = function(source, x, y) {
	if((jsc.data.cells[x][y].type != null) && ((source.totalPower - source.usedPower) > jsc.processData.power.usagePerTile)) {
		jsc.processData.power.processed[x][y] = true;
		if(!jsc.processData.power.grid[x][y]) {
			source.usedPower += jsc.processData.power.usagePerTile;
			jsc.processData.power.grid[x][y] = true;
		}
		
		var firstX = x > 0 ? x - 1 : x;
		var lastX = x < 199 ? x + 1 : x;
		var firstY = y > 0 ? y - 1 : y;
		var lastY = y < 199 ? y + 1 : y;
		
		for(var loopX = firstX; loopX <= lastX; loopX++) {
			for(var loopY = firstY; loopY <= lastY; loopY++) {
				if(loopX == x && loopY == y) {
					continue;
				}
				if(jsc.processData.power.processed[loopX][loopY]) {
					continue;
				}
				jsc.processes.power.spread(source, loopX, loopY);
			}
		}
	}
};