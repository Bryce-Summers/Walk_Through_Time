/*
 * Java Script Geometry Manager
 *
 * Written by Bryce Summers on 10/28/2015.
 */
  
 function Geometry_Manager()
 {
	this.geometry;
	this.init();
 }
 
Geometry_Manager.prototype =
{
	// Returns a Geometry Object.
	init()
	{
		this.geometry = new THREE.Geometry();
		this.geometry.dynamic = true;
				
		var r_num =    80*2;
		var c_num =    80*2;
		var x_start = -c_num/4;
		var y_start = -r_num/4;
		
				
		var scale = 1.0/2.0;
		
		var x_size = 1*scale;
		var y_size = .8660254*scale;

		var x_end = x_start + c_num*x_size;
		var y_end = y_start + r_num*y_size;
		
		var x_diff = x_end - x_start;
		var y_diff = y_end - y_start;
						
		
		// A temporary array to store texture values.
		var tex_coords = [];

		for(var r = 0; r < r_num; r++)
		for(var c = 0; c < c_num; c++)
		{
			var x = x_start + x_size*c;
			
			if(r % 2 == 0)
			{
				x += x_size/2;
			}
			
			var y = y_start + y_size*r;
			
			// Create the position vectors (with hidden metadata).
			var vec = new THREE.Vector3(x, y, 0);
			vec.original_x = vec.x;
			vec.original_y = vec.y;
					
			this.geometry.vertices.push(vec);
			
			tex_coords.push(new THREE.Vector2((x - x_start)/x_diff, (y - y_start)/y_diff));
			
			// 
		}
		
		// Elliminate the uv array.
		this.geometry.faceVertexUvs = [];
		this.geometry.faceVertexUvs.push([]);// Push one array on.

		// Link faces to positions and uv coordinates.
		for(var r = 0; r < r_num - 1; r++)
		for(var c = 0; c < c_num - 1; c++)
		{
			//       1 ----- 2
			//      / \     /
			//     /   \   /
			//    /     \ /
			//   4 ----- 3
			//    \     /
			//     \   /
			//      \ /
			//       4'
			
			
			var index1 = r*r_num + c;
			var index2 = r*r_num + c + 1;
			var index3 = (r + 1)*r_num + c;
			
			
			if(r % 2 == 0)
			{
				index3 += 1;
			}
			
			// Chooose 4 normally or 4' if we are on a boundary.
			var index4 = (c > 0) ? (index3 - 1) : (index3 + r_num);
			var index4 = index3 - 1;

			// Add the first set of triangles.
			this.add_triangle(tex_coords, index1, index2, index3);
						
			// Add the backward facing set of triangles.
			if(c > 0 || r%2 == 0)
			{
				// Add the opposite facing equilateral triangles.
				this.add_triangle(tex_coords, index1, index3, index4);
			}
			
			// Add the left column edge triangles.
			if(c == 0 && r%2 != 0)
			{
				this.add_triangle(tex_coords, index1, index3, index3 + r_num);
			}
			
			if(r%2 != 0 && c == c_num - 2)
			{
				this.add_triangle(tex_coords, index1 + 1, index3 + 1, index4 + 1);
				
				// The right rolumn edge triangles.
				if(r > 0)
				this.add_triangle(tex_coords, index3 + 1, index1 + 1, index1 - r_num + 1);
			}
				
		}

		this.geometry.uvsNeedUpdate = true;
		
		this.geometry.computeBoundingSphere();

		//this.geometry = new THREE.SphereGeometry(50, 16, 16);

		this.geometry.computeFaceNormals();
		this.geometry.computeVertexNormals();
		
		this.geometry.verticesNeedUpdate = true;
				
		// Changes to Vertex normals.
		this.geometry.normalsNeedUpdate = true;
		
		this.geometry.colorsNeedUpdate = true;
		
		return this.geometry;
	},
	
	// Adds a triangle to the geometry at the given position indices.
	add_triangle(tex_coords, index1, index2, index3)
	{
		var face = new THREE.Face3( index1, index2, index3 );
		face.color = new THREE.Color( 0xffffff );// Up triangles reflectance.
		face.vertexColors = face.color;
		this.geometry.faces.push(face);

		// 2D vector UV positions have been precomputed.
		var v1 = tex_coords[index1];
		var v2 = tex_coords[index2];
		var v3 = tex_coords[index3];
		this.geometry.faceVertexUvs[0].push([v1, v2, v3]);
	}
	
	
}