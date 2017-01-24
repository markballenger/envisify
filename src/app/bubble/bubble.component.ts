import { Component, OnInit} from '@angular/core';
import { ApiService, ApiStore } from './../shared';
import { Artist, Genre } from './../models';
import {Router} from "@angular/router";
import { Observable } from 'rxjs';

declare var d3: any;
declare var _: any;
declare var $: any;

@Component({
  selector: 'bubble', 
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss'],
})
export class BubbleComponent implements OnInit {

    protected genres: Genre[] = new Array<Genre>();

    constructor(private router:Router, private api: ApiService, private store: ApiStore) {
        // Do something with api
    }

    ngOnInit(){

      this.store.genres
        .subscribe(genres=>{
          this.genres = genres;
      });
      
      this.store.genres
        .debounce(()=> Observable.timer(650))
        .subscribe(genres=>{
          this.setupBubbles2();
      });

    }

    private maxRadius: any;
    private padding: any;
    private year_centers: any;
    private all_center: any;
    private nodes: any;
    private force: any;
    private svg: any;

    setupBubbles2(){
        var width = 500, height = 500;

        var fill = d3.scale.ordinal()
          .domain(["low", "medium", "high"])
          .range(["#31a354", "#74c476", "#c7e9c0"]) // todo: color service

        this.svg = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height);

        var max_amount = d3.max(this.genres, function (d) { return parseInt(d.count)})
        var radius_scale = d3.scale.pow().exponent(.8).domain([0, max_amount]).range([2, 85])

        _.each(this.genres, elem=> {
          elem.radius = radius_scale(elem.count)*.5;
          elem.all = 'all';
          elem.x = _.random(0, width);
          elem.y = _.random(0, height);
        })

        this.padding = 4;
        this.maxRadius = d3.max(_.map(this.genres, g=> g.radius));

        this.year_centers = {
          "2008": {name:"2008", x: 150, y: 100},
          "2009": {name:"2009", x: 250, y: 100},
          "2010": {name:"2010", x: 400, y: 100}
        }

        this.all_center = { "all": {name:"All Genres", x: 250, y: 250}};

        this.nodes = this.svg.selectAll("circle")
          .data(this.genres);

        this.nodes.enter().append("circle")
          .attr("class", "node")
          .attr("cx", function (d) { return d.x; })
          .attr("cy", function (d) { return d.y; })
          .attr("r", 6)
          .style("cursor", "pointer")
          .style("fill", d => fill(this.getFill(d)))
          .on("mouseover", function (d) { 
              $(this).popover({
                placement: 'auto top',
                container: 'body',
                trigger: 'manual',
                html : true,
                content: function() { 
                  return d.name + '<br /><i>' + d.count + ' artists</i>'; }
              });
              $(this).popover('show');
           })
          .on("click", d=>{
            this.removePopovers();
            let genres = new Array<Genre>();
            genres.push(d);
            this.store.filterArtistsByGenre(genres);
            this.router.navigate(['artists']);
          })
          .on("mouseout", d=> { this.removePopovers(); })

        this.nodes.transition().delay(200).duration(1000)
          .attr("r", function (d) { return d.radius; })

        this.force = d3.layout.force();

        this.draw('all');

        $( ".btn" ).click(function() {
          this.draw(this.id);
        });
  }


  getFill(d){
    var result = "high";
    if(d.radius > (this.maxRadius - (this.maxRadius / 3))){
      result = "high"; 
    } else if(d.radius > (this.maxRadius - (2* (this.maxRadius / 3)))){
      result = "medium";
    }else{
      result = "low";
    }
    return result;
  }


  draw (varname) {
          var foci = varname === "all" ? this.all_center: this.year_centers;
          this.force.on("tick", this.tick(foci, varname));
          this.labels(foci);
          this.force.start();
        }

  tick (foci, varname) {
          return e=> {
            for (var i = 0; i < this.genres.length; i++) {
              var o = <any>this.genres[i];
              var f = foci[o[varname]];
              o.y += (f.y - o.y) * e.alpha;
              o.x += (f.x - o.x) * e.alpha;
            }
            this.nodes
              .each(this.collide(.18))
              .attr("cx", function (d) { return d.x; })
              .attr("cy", function (d) { return d.y; });
          }
        }

  labels (foci) {
          this.svg.selectAll(".label").remove();

          this.svg.selectAll(".label")
          .data(_.toArray(foci)).enter().append("text")
          .attr("class", "label")
          .text(function (d) { return d.name })
          .attr("transform", function (d) {
            return "translate(" + (d.x - ((d.name.length)*3)) + ", " + (d.y - 275) + ")";
          });
        }

   removePopovers () {
          $('.popover').each(function() {
            $(this).remove();
          }); 
        }


   collide(alpha) {
          var quadtree = d3.geom.quadtree(this.genres);
          return d=> {
            var r = d.radius + this.maxRadius + this.padding,
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit((quad, x1, y1, x2, y2) =>{
              if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + this.padding;
                if (l < r) {
                  l = (l - r) / l * alpha;
                  d.x -= x *= l;
                  d.y -= y *= l;
                  quad.point.x += x;
                  quad.point.y += y;
                }
              }
              return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
          };
        }



}
