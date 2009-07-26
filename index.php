
<?php 
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
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Web City</title>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
		<script type="text/javascript" src="jquery.json.js"></script>
		<script type="text/javascript" src="webcity.js"></script>
		<script type="text/javascript" src="webcity.processes.js"></script>
		<script type="text/javascript" src="webcity.tools.js"></script>
		<script type="text/javascript" src="webcity.ui.js"></script>
		
		<link href="style.css" rel="stylesheet" type="text/css">
	</head>
	<body>
		<div id="menu">
			Welcome to WebCity, the web based city management game. <a href="#" id="save">Save</a> | <a href="#" id="pause">Pause</a>
		</div>
		<div id="body">
			<?php require("grid.php"); ?>
		</div>
			<div id="status-bar">
				<span id="cash">$10,000</span> | 
				<span id="co-ords">X:0 Y:0</span> | 
				<span id="time">1/1/1900</span> | 
				Population: <span id="pop">0</span> |
				RCI:
				R:<span id="RCI-R"></span> C:<span id="RCI-C"></span> I:<span id="RCI-I"></span>
		</div>
		<div id="toolbox" class="drag-target">
			<h2>Tools</h2>
			<table id="tools">
				<tr><td id="res"><img src="images/res.png" alt="Zone Residential" width="30" height="30" title="Residential" /></td><td id="com"><img src="images/com.png" alt="Zone Commercial" width="30" height="30" title="Commercial" /></td></tr>
				<tr><td id="ind"><img src="images/ind.png" alt="Zone Industrial" width="30" height="30" title="Industrial" /></td><td id="road"><img src="images/road.png" alt="Lay Road" width="30" height="30" title="Road" /></td></tr>
				<tr><td id="coal"><img src="images/coal-power.png" alt="Coal Power Plant" width="30" height="30" title="Coal" /></td><td id="query"><img src="images/query.png" alt="Query" width="30" height="30" title="Query" /></td></tr>
			</table>
		</div>
		<div id="cash-cursor">
		</div>
		<div id="load-div">
		</div>
		<div id="tool-follower">
		&nbsp;
		</div>
		<div id="overlay">
		</div>
	</body>
</html>
