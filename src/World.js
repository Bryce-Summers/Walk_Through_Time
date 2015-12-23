/*
 * Java Script World Handler. This class stores a
 * vector valued function in two variables.
 *
 * Written by Bryce Summers on 10/28/2015.
 */
  
 function World()
 {
	this.time = 0;
	this.state = 0;
	this.text_fade_time = 0;
	
	this.moveScale = 1;
	
	this.STRESS    = 0;
	this.CURIOSITY = 1;
	this.ZONE_PLATE = 2;
	this.HAPPINESS = 3;
	this.SEARCH = 4;
	this.MORPH = 5;
	this.SPHERE = 6;
	this.KLEIN_BOTTLE = 7;

	this.scene_num = 8;
	
	this.state = this.CURIOSITY;
	this.state = this.ZONE_PLATE;
	this.state = this.STRESS;
	this.state = this.HAPPINESS;
	this.state = this.SEARCH;
	this.state = this.MORPH;
	
	this.state = this.SPHERE;
	
	this.state = this.KLEIN_BOTTLE;
	
	// The Angle of current movement.
	this.theta = 0;
	
 }
 
World.prototype =
{
	// Returns a Geometry Object.
	height(x, y)
	{
		if(this.state == this.STRESS)
		{
			return Math.cos(Math.radians(x + this.time*(1 + .01*Math.cos(this.time*2)))) + .5*Math.sin(Math.radians(this.time*3 + y*16));
		}
		
		if(this.state == this.CURIOSITY)
		{
			x *= 30;
			y *= 30;
			
			x += 10*Math.cos(Math.radians(this.time));
			y += 10*Math.cos(Math.radians(this.time));
			
			var val =  3*Math.cos(Math.radians(x))*Math.cos(Math.radians(x*1.01))*Math.cos(Math.radians(y*1.02))*Math.cos(Math.radians(y*1.03)) +
			   		     Math.cos(Math.radians(x*2 + y))* Math.cos(Math.radians(x + y*3));
						 
			var lowFreq = Math.sin(Math.radians(Math.sqrt(x*x + y*y) /100));
			
			var highFreq = .1*Math.sin(Math.radians(2*x + y* 100));
			
			
			return val + 10*lowFreq + highFreq;
			
		}
		
		if(this.state == this.ZONE_PLATE)
		{
			x += Math.cos(Math.radians(this.time));
			y += Math.sin(Math.radians(this.time));
			
			var zone_plate = 5*Math.sin(Math.radians(x*x + y*y));
			return zone_plate;
		}
		
		
		if(this.state == this.HAPPINESS)
		{

			var f1 = Math.abs(Math.abs((this.time - x) % 100) - 50)/50;
			var f2 = Math.abs(Math.abs((this.time - y) % 40) - 20)/20;
									
			var f4 = Math.abs(Math.abs((this.time - x + y) % 30) - 15)/15;
			
			var low_freq_x = 2*Math.sin(Math.radians(x));
			var low_freq_y = 2*Math.cos(Math.radians(y));
			
			return f1 + f2 +  f4 + low_freq_x*Math.sin(Math.radians(x*5)) + low_freq_y*Math.cos(Math.radians(y*6));
			
			
		}
		
		if(this.state == this.SEARCH)
		{
			
			return -15 + 20*Math.sin(Math.radians(x*5))*Math.sin(Math.radians(y*5));
		}
		
		if(this.state == this.MORPH)
		{
			x *= .1;
			y *= .1;
			return Math.sin(Math.radians(player_x*20 + player_y*5) * Math.sin(Math.radians(y*10))*Math.cos(Math.radians(x*3)));
		}
		
		if(this.state == this.SPHERE || this.state == this.KLEIN_BOTTLE)
		{
			// All work done in offset for a pure vector valued curve.
			return 0;
		}
		
		
		return 0;
	},
	
	position(x, y)
	{
		var pos_z = this.height(x,y);
		var offset = this.offset(x, y);
		
		return new THREE.Vector3(x + offset.x, y + offset.y, pos_z + offset.z);
	},
	
	tangent(x, y)
	{
		var pos  = this.position(x, y);
		var dx = (this.position(x + .001, y).sub(pos)).divideScalar(.001);
		var dy = (this.position(x, y + .001).sub(pos)).divideScalar(.001);		
				
		var mag = Math.sqrt(dx*dx + dy*dy + 1);
		
		var output = dx.cross(dy).normalize();
		
		return output;
		
	},
	
	offset(x, y)
	{

		if(this.state == this.SEARCH)
		{
			/*
			var h0 =  this.height(x, y);
			var dx = (this.height(x + .0001, y) - h0) / .0001;
			var dy = (this.height(x, y + .0001) - h0) / .0001;
			
			var x_off = dx;
			var y_off = dy;
			var z_off = 1;
			
			var mag = Math.sqrt(dx*dx + dy*dy + 1);
			x_off /= mag;
			y_off /= mag;
			z_off /= mag;
			*/
			
			// I want humps on top of hills.
			
			var x_off = 6*Math.cos(Math.radians(2*x*5 + 90));
			var y_off = 6*Math.cos(Math.radians(2*y*5 + 90));
			var z_off = 0;
			
			return new THREE.Vector3(x_off, y_off, z_off);
		}
		
		if(this.state == this.SPHERE)
		{
			
			var grid_x = x - player_x;
			var grid_y = y - player_y;
			
			var x_off = 20*Math.cos(Math.radians(x*2)) + 5*Math.sin(Math.radians(y*8));
			var y_off = 10*Math.sin(Math.radians(y*5)) + 5*Math.cos(Math.radians(x*8));
			var z_off = 20*Math.sin(Math.radians(x*2)) + 10*Math.cos(Math.radians(y*5));
			
			// use x + player_x to negate the reconversion in the geometry usage.
			return new THREE.Vector3(-x + player_x + x_off, -y + player_y + y_off, z_off);
		}
		
		if(this.state == this.KLEIN_BOTTLE)
		{			
			var grid_x = x - player_x;
			var grid_y = y - player_y;
			
			// Convert to radians.
			var u = Math.radians(x*2);
			var v = Math.radians(y*2);
			var sqrt_2 = Math.sqrt(2);
			
			// Paremetric description of a klein bottle.
			var x_off = 20*(Math.cos(u)*(Math.cos(u/2)*(sqrt_2+Math.cos(v))+(Math.sin(u/2)*Math.sin(v)*Math.cos(v))));
			var y_off = 20*(Math.sin(u)*(Math.cos(u/2)*(sqrt_2+Math.cos(v))+(Math.sin(u/2)*Math.sin(v)*Math.cos(v))));
			var z_off = 20*(-1*Math.sin(u/2)*(sqrt_2 + Math.cos(v)) + Math.cos(u/2)*Math.sin(v)*Math.cos(v));

			// use x + player_x to negate the reconversion in the geometry usage.
			return new THREE.Vector3(-x + player_x + x_off, -y + player_y + y_off, z_off);
		}

		return new THREE.Vector3(0, 0, 0);
	},
	
	forward_direction()
	{
		return new THREE.Vector3(Math.cos(this.theta),
								 Math.sin(this.theta),
								 0);
	},
	
	update()
	{
		this.time++;
				
		
		if ( keyboard.pressed("left") || keyboard.pressed("A") )
		{
			//player_x -= this.moveScale;
			this.theta += .1;
		}
		
		if ( keyboard.pressed("right") || keyboard.pressed("D") )
		{
			//player_x += this.moveScale;
			this.theta -= .1;
		}
		
		if ( keyboard.pressed("down") || keyboard.pressed("S") )
		{
			//player_y += this.moveScale;
			
			var dir = this.forward_direction();
			
			player_x -= this.moveScale*dir.x;
			player_y -= this.moveScale*dir.y;
			//this.theta + .01;
		}
		
		if ( keyboard.pressed("up") || keyboard.pressed("W") )
		{
			//player_y -= this.moveScale;
			
			var dir = this.forward_direction();
			
			player_x += this.moveScale*dir.x;
			player_y += this.moveScale*dir.y;
		}
		
		/*
		if (keyboard.down(" "))// 'q'
		{
			this.state = (this.state + this.scene_num - 1)%this.scene_num;
						
			this.reset_scene();
		}
		*/
		
		if(keyboard.down("space"))// 'e'
		{
			this.state = (this.state + 1) % this.scene_num;
					
			this.reset_scene();
			
			// Clear the instructions,
			// when the user has demonstrated that they know how to switch scenes.
			text3.innerHTML = "";
		}
		
		
		
		if(this.state == this.STRESS)
		{
			mat_player.color  = new THREE.Color( 0x0000f0 );
			mat_terrain.color = new THREE.Color( 0xf000f0 );
			
			text2.innerHTML = "Stress";
			this.moveScale = .01;
			camera_looseness = 9;
			camera.position.z = 20;
			use_tangent_camera = false;
		}
		
		if(this.state == this.CURIOSITY)
		{
			
			mat_player.color  = new THREE.Color( 0xF0A000 );
			mat_terrain.color = new THREE.Color( 0xFFFFFF );
			
			text2.innerHTML = "Curiosity";
			this.moveScale = .2;
			camera_looseness = 30;
			camera.position.z = 20;
			use_tangent_camera = false;
		}
		
		if(this.state == this.ZONE_PLATE)
		{
			mat_player.color  = new THREE.Color( 0x0000f0 );
			mat_terrain.color = new THREE.Color( 0xFF0000 );
			
			text2.innerHTML = "Zone Plate";
			this.moveScale = 1.0;
			camera_looseness = 30;
			camera.position.z = 20;
			use_tangent_camera = false;
		}
		
		if(this.state == this.HAPPINESS)
		{
			mat_player.color  = new THREE.Color( 0xFFFF00 );
			mat_terrain.color = new THREE.Color( 0xAFAFF0 );
			
			text2.innerHTML = "Happiness";
			this.moveScale = 1.0;
			camera_looseness = 60;
			camera.position.z = 15;
			use_tangent_camera = false;
		}
		
		if(this.state == this.SEARCH)
		{
			mat_player.color  = new THREE.Color( 0xFFFF00 );
			mat_terrain.color = new THREE.Color( 0xAFAFF0 );
			//mat_terrain.color = new THREE.Color( 0xFFFFFF );
			
			text2.innerHTML = "Searching.";
			this.moveScale = .2;
			camera_looseness = 30;
			//camera.position.z = 20;
			
			use_tangent_camera = true;
		}
		
		if(this.state == this.MORPH)
		{
			mat_player.color  = new THREE.Color( 0xFFFF00 );
			mat_terrain.color = new THREE.Color( 0x3F3FFF );
			//mat_terrain.color = new THREE.Color( 0xFFFFFF );
			
			text2.innerHTML = "MORPH";
			this.moveScale = .2;
			camera_looseness = 15;
			camera.position.z = 20;
			
			use_tangent_camera = false;
		}
		
		if(this.state == this.SPHERE)
		{
			mat_player.color  = new THREE.Color( 0xFFFF00 );
			mat_terrain.color = new THREE.Color( 0xFFFFFF );
						
			text2.innerHTML = "Sinous inflection";
			this.moveScale = .2;
			camera_looseness = 30;
			//camera.position.z = 20;
			
			use_tangent_camera = true;
			
			// Only show front faces.
			mat_terrain.side = THREE.FrontSide;
			
		}
		
		if(this.state == this.KLEIN_BOTTLE)
		{
			
			text2.innerHTML = "The one-sided argument.";
			this.moveScale = 1;
			camera_looseness = 10;
			use_tangent_camera = true;
			
			mat_terrain.side = THREE.DoubleSide;
			
			mat_player.color  = new THREE.Color( 0xFFFFFF );
			mat_terrain.color = new THREE.Color( 0xFFFFFF );
		}


		if(this.text_fade_time < 100)
		{
			this.text_fade_time++;
		}
		else // If the fade time has elapsed, then we clear the text from being drawn to the screen.
		{
			text2.innerHTML = "";
		}
		
		/*
		if ( keyboard.pressed("D") )
			mesh.translateX(  moveDistance );
			
		if ( keyboard.down("R") )
			mesh.material.color = new THREE.Color(0xff0000);
		if ( keyboard.up("R") )
			mesh.material.color = new THREE.Color(0x0000ff);
		*/
		
		
		
	},
	
	reset_scene()
	{
		this.time = 0;
		
		var radius = 1000;
		var angle = Math.random()*2*Math.PI;
		
		player_x = radius*Math.cos(angle);
		player_y = radius*Math.sin(angle);
		
		console.log("help!");
		
		// Variables for enabling the HUD text when the user has switched scenes.
		this.text_fade_time = 0;
	}
}