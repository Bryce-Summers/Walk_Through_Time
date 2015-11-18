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

		var r_num = 80*2;
		var c_num = 80*2;
		var x_start = -20*2;
		var y_start = -20*2;
		
		var scale = 1.0/2.0;
		
		var x_size = 1*scale;
		var y_size = .8660254*scale;

		
		for(var r = 0; r < r_num; r++)
		for(var c = 0; c < c_num; c++)
		{
			var x = x_start + x_size*c;
			
			if(r % 2 == 0)
			{
				x += x_size/2;
			}
			
			// Create a vector with hidden metadata.
			var vec = new THREE.Vector3(x, y_start + y_size*r, 0);
			vec.original_x = vec.x;
			vec.original_y = vec.y;
			
			this.geometry.vertices.push(vec);
			
			this.geometry.colors.push( new THREE.Color( 0x00aaff ) );			
		}

		for(var r = 0; r < r_num - 1; r++)
		for(var c = 0; c < c_num - 1; c++)
		{
			var index1 = r*r_num + c;
			var index2 = r*r_num + c + 1;
			var index3 = (r + 1)*r_num + c;
			
			
			if(r % 2 == 0)
			{
				index3 += 1;
			}
			
			var index4 = index3 - 1;

			var face = new THREE.Face3( index1, index2, index3 );
			face.color = new THREE.Color( 0xffffff );// Up triangles reflectance.
			face.vertexColors = face.color;
			this.geometry.faces.push(face);
			
			// Add the opposite facing equilateral triangles.
			if(c > 0)
			{
				face = new THREE.Face3( index1, index3, index4 );
				face.color = new THREE.Color( 0xafafaf );// Down triangles reflectance.
				//face.color = new THREE.Color( 0xffffff );
				face.vertexColors = face.color;
				this.geometry.faces.push(face);
			}
			
		}

		this.geometry.computeBoundingSphere();

		//this.geometry = new THREE.SphereGeometry(50, 16, 16);

		this.geometry.computeFaceNormals();
		this.geometry.computeVertexNormals();
		
		this.geometry.verticesNeedUpdate = true;
				
		// Changes to Vertex normals.
		this.geometry.normalsNeedUpdate = true;
		
		this.geometry.colorsNeedUpdate = true;
		
		return this.geometry;
	}
}