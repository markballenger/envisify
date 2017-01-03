import { Component, OnInit} from '@angular/core';
import { ApiService } from './../shared';
import { Artist, Genre } from './../models';
import {Router} from "@angular/router";


declare var d3: any;
declare var _: any;
declare var $: any;

@Component({
  selector: 'bubble', 
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss'],
})
export class BubbleComponent implements OnInit {

    artists : Artist[];
    genres: Genre[] = new Array<Genre>();

    constructor(private router:Router, private api: ApiService) {
        // Do something with api
    }

    ngOnInit(){

        if(!this.artists){

            // start with an empty array
            this.artists = new Array<Artist>();
            this.genres = new Array<Genre>();

            // subscribe and wait for the return
            this.api.getAllArtists()
                .finally(()=> this.setupBubbles2())
                .subscribe((artists: Artist[])=>{
                    this.artists = this.artists.concat(artists);
                    this.populateGenres(artists);
            });
        }

    }

    private maxRadius: any;
    private padding: any;
    private year_centers: any;
    private all_center: any;
    private nodes: any;
    private force: any;
    private svg: any;

    setupBubbles2(){
        var width = 1000, height = 1000;

        var fill = d3.scale.ordinal()
          .domain(["low", "medium", "high"])
          .range(["#d84b2a", "#beccae", "#7aa25c"])

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
          "2008": {name:"2008", x: 150, y: 300},
          "2009": {name:"2009", x: 550, y: 300},
          "2010": {name:"2010", x: 900, y: 300}
        }

        this.all_center = { "all": {name:"All Genres", x: 500, y: 300}};

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
            this.router.navigate(['account', {genre: d.id}]);
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

    //
    // populateGenres
    //
    populateGenres(artists: Artist[]){
        _.each(artists, a=>{
            _.each(a.genres, genre=>{
               let item = _.find(this.genres, g=>g.name === genre);
               if(!item){
                   item = new Genre(genre, genre);
                    this.genres.push(item);
               }
               item.count++;
            });
        });
    }

}
