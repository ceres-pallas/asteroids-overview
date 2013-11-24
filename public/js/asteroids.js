var universe = (function(){
    var canvas = document.getElementById('overview');
    var g = canvas.getContext('2d');

    var Drawable = Class.extend( {
	init: function(options) {
	    this.x = options.x;
	    this.y = options.y;
	    this.color = options.color || "white";
	    this.radius = options.radius;
	    
	},

	draw: function(){
	    //draw object on canvas
	    g.fillStyle = this.color;
	    g.translate(this.x, this.y);
	}
	
    })

    var DisplayList = Drawable.extend ({
	init : function() {
	    this.drawables = [];
	},
	draw: function() {
	    for(id in this.drawables) {
		this.drawables[id].draw();
	    }
	},
	push: function(drawable) {
	    if(drawable instanceof Drawable) {	
		this.drawables.push(drawable);
	    }
	}
	
    });
    var Triangle = Drawable.extend( {
	init: function(x1,y1, x2,y2, x3,y3, color) {
	    this.points = [
		{x: x1,y: y1},
		{x: x2,y: y2},
		{x: x3,y: y3}
	    ];
	    this.color = color;
	}, 
	draw: function() {
	    g.save();
	    if(this.color) {
		g.fillStyle = this.color;
	    }
	    
	    g.beginPath();
	    //g.translate(this.points[0].x, this.points[0].y);
	    g.lineTo(this.points[1].x, this.points[1].y);
	    g.lineTo(this.points[2].x, this.points[2].y);
	    g.lineTo(this.points[0].x, this.points[0].y);
	    g.fill();
	    g.closePath();
	    g.restore();
	}
    })
				    
    var Sphere = Drawable.extend( {
	init: function(x, y, radius) {
	    this.x = x;
	    this.y = y;
	    this.radius = radius;
	},	
	draw: function() {
	    g.save();
	    g.translate(this.x, this.y);
	    g.beginPath();
	    g.arc(0,0, this.radius, 0, 2*Math.PI);
	    g.fill();
	    g.closePath();	    
	    g.restore();
	}
    });
	
    var Rect = Drawable.extend( {
	init: function(x, y, width, height) {
	    this.x = x;
	    this.y = y;
	    this.width = width;
	    this.height = height;
	},
	draw: function() {
	    g.save()
	    g.translate(this.x, this.y);
	    g.fillRect(0, 0, this.width, this.height);
	    g.restore();
	}
    });
    var Fighter = Drawable.extend( {
	init : function(options) {
	    this._super(options);
	    this.heading = options.heading;
	    this.speed = options.speed;
	    this.orientation = options.orientation;

	    this.displayList = new DisplayList();

	    var warpNesselDimension =
		{
		    width: 0.4 * this.radius,
		    height: this.radius
	    }
	    
	    var diameter = 2*this.radius;
	    var warpCouplingWidth = 0.1 * this.radius;
	    
	    var cannonCouplingWidth = 0.1 * this.radius;
	    
	    var bodyRadius = 0.5* this.radius;
	    this.displayList.push(new Rect(-this.radius,
					   0,warpNesselDimension.width,warpNesselDimension.height)); 
	    this.displayList.push(new Rect(this.radius-warpNesselDimension.width, 
					   0,warpNesselDimension.width,warpNesselDimension.height));
	    this.displayList.push(new Sphere(0,0.5*this.radius,bodyRadius));
	    this.displayList.push(new Rect(-this.radius+warpNesselDimension.width,
					   0.5*this.radius-0.5*warpCouplingWidth, 
					   warpCouplingWidth, warpCouplingWidth));
	    this.displayList.push(new Rect(this.radius-warpNesselDimension.width-warpCouplingWidth,
					   0.5*this.radius-0.5*warpCouplingWidth, 
					   warpCouplingWidth, warpCouplingWidth));
	    this.displayList.push(new Rect(0-0.5*cannonCouplingWidth,
					   0.5*this.radius-cannonCouplingWidth-bodyRadius, 
					   cannonCouplingWidth, cannonCouplingWidth));
	    
	    var grad = g.createLinearGradient(
		    -this.radius + 0.5* warpNesselDimension.width,warpNesselDimension.height,
		    -this.radius + 0.5* warpNesselDimension.width,warpNesselDimension.height + 1* this.speed
	    );
	    grad.addColorStop(0,"red");
	    grad.addColorStop(1,"yellow");
	    this.displayList.push(new Triangle(-this.radius,warpNesselDimension.height,
					   -this.radius + 0.5* warpNesselDimension.width,warpNesselDimension.height + 2* this.speed,
					   -this.radius + warpNesselDimension.width,warpNesselDimension.height,
					   grad ));
	    
    	    this.displayList.push(new Triangle(this.radius - warpNesselDimension.width,warpNesselDimension.height,
					   this.radius - warpNesselDimension.width + 0.5* warpNesselDimension.width,warpNesselDimension.height + 2* this.speed,
					   this.radius - warpNesselDimension.width + warpNesselDimension.width,warpNesselDimension.height,
					   grad ));
	    
	    
	    this.displayList.push(new Triangle(-0.35*this.radius,-cannonCouplingWidth,
					       0,-this.radius,
					       0.35*this.radius,-cannonCouplingWidth
					      ));
	},
	draw : function() {
	    g.save();
	    this._super();
	    g.rotate(this.orientation);
	    
	    this.displayList.draw();
	    //g.strokeRect(-0.5*this.radius,-0.5*this.radius,this.radius, this.radius);
	    
	    g.beginPath();
	    
	    g.stroke();
	    g.closePath();
	    g.restore();
	}
	
    } );

    var Asteroid = Drawable.extend({
    });

    
    
    var displayList = new DisplayList();
    displayList.push( 
	new Fighter (
	    {
		x: 300,
		y: 200,
		radius: 90,
		heading: 0,
		speed:60,
		orientation: 0.4*Math.PI,
		color: "red"
	    }
	)
    );

    displayList.push( 
	new Fighter (
	    {
		x: 500,
		y: 200,
		radius: 30,
		heading: 0,
		speed: 10,
		orientation: 0.25*Math.PI,
		color: "blue"
	    }
	)
    );

    displayList.push( 
	new Fighter (
	    {
		x: 450,
		y: 130,
		radius: 30,
		heading: 0,
		speed: 10,
		orientation: 0.25*Math.PI,
		color: "blue"
	    }
	)
    );

    displayList.push( 
	new Fighter (
	    {
		x: 400,
		y: 220,
		radius: 30,
		heading: 0,
		speed: 10,
		orientation: 0.25*Math.PI,
		color: "blue"
	    }
	)
    );

    displayList.draw();
		     

   
})()
