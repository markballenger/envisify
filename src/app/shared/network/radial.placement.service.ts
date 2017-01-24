import { Injectable } from '@angular/core';

declare var d3: any;

@Injectable()
export class RadialPlacementService{

    constructor(){

    }

    private _center: any = {
        "x": 0,
        "y": 0
    };
    private _start: any = -120;
    private _current: any = this._start; 
    private _increment: any = 20; 
    private _radius: any = 200;
    private _values: any = d3.map();
    
    private radialLocation(center, angle, radius) {
        var x, y;
        x = center.x + radius * Math.cos(angle * Math.PI / 180);
        y = center.y + radius * Math.sin(angle * Math.PI / 180);
        return {
            "x": x,
            "y": y
        };
    };

    //
    // placement
    //
    private placement(key) {
        var value;
        value = this._values.get(key);
        if (!this._values.has(key)) {
            value = this.place(key);
        }
        return value;
    };

    //
    // place
    //
    private place(key) {
        var value;
        console.log(key);
        value = this.radialLocation(this._center, this._current, this._radius);
        this._values.set(key, value);
        this._current += this.increment;
        return value;
    };

    //
    // setKeys
    //
    private setKeys(keys) {
        var firstCircleCount, firstCircleKeys, secondCircleKeys;
        this._values = d3.map();
        firstCircleCount = 360 / this._increment;
        if (keys.length < firstCircleCount) {
            this._increment = 360 / keys.length;
        }
        firstCircleKeys = keys.slice(0, firstCircleCount);
        firstCircleKeys.forEach(function(k) {
            return this.place(k);
        });
        secondCircleKeys = keys.slice(firstCircleCount);
        this._radius = this._radius + this._radius / 1.8;
        this._increment = 360 / secondCircleKeys.length;
        return secondCircleKeys.forEach(function(k) {
            return this.place(k);
        });
    };

    private keys(_) {
        if (!arguments.length) {
            return d3.keys(this._values);
        }
        this.setKeys(_);
        return this.placement;
    };
    public center(_) {
        if (!arguments.length) {
            return this._center;
        }
        this.center = _;
        return this.placement;
    };
    private radius(_) {
        if (!arguments.length) {
            return this._radius;
        }
        this.radius = _;
        return this.placement;
    };
    private start(_) {
        if (!arguments.length) {
            return this._start;
        }
        this._start = _;
        this._current = this._start;
        return this.placement;
    };
    private increment(_) {
        if (!arguments.length) {
            return this._increment;
        }
        this._increment = _;
        return this.placement;
    };
    

}