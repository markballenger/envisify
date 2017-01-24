import { Component, OnInit } from '@angular/core';
import { ApiStore } from './../shared';
import { Artist, Genre } from './../models';

declare var _ : any;
declare var d3 : any;
declare var packages : any;

@Component({
    selector: 'chord',
    templateUrl: './chord.component.html',
    styleUrls: ['./chord.component.scss']
})
export class ChordComponent implements OnInit {

    private svg : any;
    private m0 : any;
    private div : any;
    private rx : number;
    private ry : number;
    private rotate : number = 0;

    artists : Artist[];
    //genres: Genre[] = new Array<Genre>();

    constructor(protected store: ApiStore){


    }

    ngOnInit(){
        
        this.store.artistsFiltered
            
            .map((artists: Artist[])=>{

                var related = _.flatten(_.map(artists, 'relatedArtists'));
                related = _.uniqBy(related, 'name');

                var concated = _.uniqBy(artists.concat(related), 'name');
                return concated;
            })
            
            .map((artists: Artist[])=>{

                return _.map(artists, a=>{
                    return {
                        name: a.name,
                        children: a.relatedArtists
                    };
                });
            })
            .subscribe((artists: any[])=>{
                this.artists = artists;
                if(this.artists && this.artists.length > 0)
                    this.setupD3();
            });
    }

    //
    //
    //
    setupD3(){
        var w = 1280,
            h = 800,
            rx = w / 2,
            ry = h / 2,
            m0,
            rotate = 0;

        var splines = [];

        var cluster = d3.layout.cluster()
            .size([360, ry - 120])
            .sort(function(a, b) { return d3.ascending(a.key, b.key); });

        var bundle = d3.layout.bundle();

        var line = d3.svg.line.radial()
            .interpolate("bundle")
            .tension(.85)
            .radius(function(d) { return d.y; })
            .angle(function(d) { return d.x / 180 * Math.PI; });

        // Chrome 15 bug: <http://code.google.com/p/chromium/issues/detail?id=98951>
        this.div = d3.select("body").insert("div", "h2")
            .style("top", "-80px")
            .style("left", "-160px")
            .style("width", w + "px")
            .style("height", w + "px")
            .style("position", "absolute")
            .style("-webkit-backface-visibility", "hidden");

        var svg = this.div.append("svg:svg")
            .attr("width", w)
            .attr("height", w)
            .append("svg:g")    
            .attr("transform", "translate(" + rx + "," + ry + ")");

        svg.append("svg:path")
            .attr("class", "arc")
            .attr("d", d3.svg.arc().outerRadius(ry - 120).innerRadius(0).startAngle(0).endAngle(2 * Math.PI))
            //.on("mousedown", this.mousedown)
            ;

        let nodes = cluster.nodes(this.root(this.artists));
        let links = this.imports(nodes);
        splines = bundle(links);

        let path = svg.selectAll("path.link")
            .data(links)
            .enter().append("svg:path")
            .attr("class", function(d) { return "link source-" + d.source.key + " target-" + d.target.key; })
            .attr("d", function(d, i) { return line(splines[i]); });
        svg.selectAll("g.node")
            .data(nodes.filter(function(n) { return !n ||  !n.children; }))
            .enter().append("svg:g")
            .attr("class", "node")
            .attr("id", function(d) { return "node-" + d.key; })
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
            .append("svg:text")
            .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
            .attr("dy", ".31em")
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
            .text(function(d) { return d.key; })
            //.on("mouseover", this.mouseover)
            //.on("mouseout", this.mouseout)
            ;

        d3.select("input[type=range]").on("change", function() {
                line.tension(this.value / 100);
                path.attr("d", function(d, i) { return line(splines[i]); });
            });

        d3.select(window)
            //.on("mousemove", this.mousemove)
            //.on("mouseup", this.mouseup)
            ;
    }

    // mouse(e) {
    //     return [e.pageX - this.rx, e.pageY - this.ry];
    // }

    // mousedown() {
    //     this.m0 = this.mouse(d3.event);
    //     d3.event.preventDefault();
    // }

    // mousemove() {
    //     if (this.m0) {
    //         var m1 = this.mouse(d3.event),
    //             dm = Math.atan2(this.cross(this.m0, m1), this.dot(this.m0, m1)) * 180 / Math.PI;
    //         this.div.style("-webkit-transform", "translateY(" + (this.ry - this.rx) + "px)rotateZ(" + dm + "deg)translateY(" + (this.rx - this.ry) + "px)");
    //     }
    // }

    // mouseup() {
    //     if (this.m0) {
    //         var m1 = this.mouse(d3.event),
    //             dm = Math.atan2(this.cross(this.m0, m1), this.dot(this.m0, m1)) * 180 / Math.PI;

    //         this.rotate += dm;
    //         if (this.rotate > 360) this.rotate -= 360;
    //         else if (this.rotate < 0) this.rotate += 360;
    //         this.m0 = null;

    //         this.div.style("-webkit-transform", null);

    //         this.svg
    //             .attr("transform", "translate(" + this.rx + "," + this.ry + ")rotate(" + this.rotate + ")")
    //             .selectAll("g.node text")
    //             .attr("dx", function(d) { return (d.x + this.rotate) % 360 < 180 ? 8 : -8; })
    //             .attr("text-anchor", function(d) { return (d.x + this.rotate) % 360 < 180 ? "start" : "end"; })
    //             .attr("transform", function(d) { return (d.x + this.rotate) % 360 < 180 ? null : "rotate(180)"; });
    //     }
    // }

    // mouseover(d) {
    //     this.svg.selectAll("path.link.target-" + d.key)
    //         .classed("target", true)
    //         .each(this.updateNodes("source", true));

    //     this.svg.selectAll("path.link.source-" + d.key)
    //         .classed("source", true)
    //         .each(this.updateNodes("target", true));
    // }

    // mouseout(d) {
    //     this.svg.selectAll("path.link.source-" + d.key)
    //         .classed("source", false)
    //         .each(this.updateNodes("target", false));

    //     this.svg.selectAll("path.link.target-" + d.key)
    //         .classed("target", false)
    //         .each(this.updateNodes("source", false));
    // }

    // updateNodes(name, value) {
    //     return function(d) {
    //         if (value) this.parentNode.appendChild(this);
    //         this.svg.select("#node-" + d[name].key).classed(name, value);
    //     };
    // }

    // cross(a, b) {
    //     return a[0] * b[1] - a[1] * b[0];
    // }

    // dot(a, b) {
    //     return a[0] * b[0] + a[1] * b[1];
    // }

    protected map = {};

    root(artists) {
      
      _.each(artists, artist=>{
        this.find(artist);
      });
      return this.map[""];
    }

    find(artist: any) {
        let node = this.map[artist.name || ''];
        let i;
        if (!node) {
          node = this.map[artist.name || ''] = artist || {name: artist.name, children: []};
          if (artist.name && artist.name.length) {
            node.parent = this.find(artist); // should be findParent, but there could be multiple :(
            node.parent.children.push(node);
            node.key = artist.name;
          }
        }
        return node;
    }

    imports(nodes) {
      let map = {};
      let imports = [];

      // Compute a map from name to node.
      _.each(nodes, (d)=> {
        map[d.name] = d;
      });

      // For each import, construct a link from the source to target node.
      nodes.forEach(d=> {
        if (d.imports) 
        {
            d.imports.forEach(i=> 
                imports.push({source: map[d.name], target: map[i]})
            );
        }
      });

      return imports;
    }

}