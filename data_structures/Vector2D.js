function Vector2D (x, y) {
	if (!(this instanceof Vector2D)) {
		return new Vector2D (x, y);
    }
    this.x = x || 0;
    this.y = y || 0;

    Vector2D.prototype.add = function (other_v) {
        if (!(other_v instanceof Vector2D)){
            return this;
        }
        return new Vector2D (this.x + other_v.x, this.y + other_v.y);
    }

    Vector2D.prototype.substract = function (other_v) {
        if (!(other_v instanceof Vector2D)){
            return this;
        }
        return new Vector2D (this.x - other_v.x, this.y - other_v.y);
    }

    Vector2D.prototype.negate = function () {
        return new Vector2D (-this.x, -this.y);
    }

    Vector2D.prototype.len = function () {
        return Math.hypot (this.x, this.y);
    }

    Vector2D.prototype.lenSq = function () {
        return this.dot(this);
    }

    Vector2D.prototype.multiply = function (factor) {
        return new Vector2D (this.x * factor, this.y * factor);
    }

    Vector2D.prototype.unit = function () {
        return this.multiply (1/this.len());
    }

    Vector2D.prototype.dot = function (v2) {
        if (!(v2 instanceof Vector2D)){
            return 0;
        }
        return this.x*v2.x + this.y*v2.y;
    }

    Vector2D.prototype.dotPerp = function (v2) {
        if (!(v2 instanceof Vector2D)){
            return 0;
        }
        return this.dot (v2.getNormalCCW());
    }

    Vector2D.prototype.getNormalCCW = function () {
        return new Vector2D (this.y, -this.x);
    }

    Vector2D.prototype.getNormalCW = function () {
        return new Vector2D (-this.y, this.x);
    }

    Vector2D.prototype.getUnitNormalCCW = function () {
        return new Vector2D (this.y/this.len(), -this.x/this.len());
    }

    Vector2D.prototype.getUnitNormalCW = function () {
        return new Vector2D (-this.y/this.len(), this.x/this.len());
    }

    Vector2D.prototype.round = function (num_decimals = 4) {
        var pres = Math.pow(10,num_decimals);
        this.x = Math.round(this.x *pres) / pres;
        this.y = Math.round(this.y *pres) /pres;
        return this;
    }

    Vector2D.prototype.equals = function (v) {
        if (!(v instanceof Vector2D)){
            return false;
        }

        if (v === this){
            return true;
        }

        return (Math.abs(this.x - v.x) <= 0.0001) && (Math.abs(this.y - v.y) <= 0.0001);

    }
}

export {Vector2D};
