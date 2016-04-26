//Classes are not hoisted like js functions
// 

class Polygon {
  
  constructor(height, width) {
  	this.stuff = "stuff";
    this.height = height;
    this.width = width;
  }

  get area() {
    return this.calcArea();
  }

  calcArea() {
    return this.height * this.width;
  }

  setColor(color){
  	this.color = color;
  }

}

class DomPolygon extends Polygon{
  
  constructor(width, height){
  	super(width, height);
  	this.nameOfObject = "DomSquare";
  	this.element = document.createElement("div");
  	this.element.style.position = "absolute";
  	this.element.style.width = width;
  	this.element.style.height= height;
  }

  get area() {
    return this.calcArea();
  }

  calcArea() {
    return this.height * this.width;
  }

  setColor(color){
  	this.element.style.background = color;
  }

  setPosition(left, top){
  	this.element.style.left = left;
  	this.element.style.top = top;
  }

}
