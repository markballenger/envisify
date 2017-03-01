import { Component, OnInit} from '@angular/core';
import { ApiStore, FilterService, ResizeService } from './../shared';
import { Artist, Genre } from './../models';
import {Router} from "@angular/router";
import { Observable } from 'rxjs';

declare var d3: any;
declare var _: any;
declare var $: any;
declare var Color: any;

@Component({
  selector: 'bubble', 
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss'],
})
export class BubbleComponent implements OnInit {

    protected genres: Genre[] = new Array<Genre>();
    resizeStream: Observable<any> =Observable.fromEvent(window, "resize");

    constructor(
      private router:Router, 
      private filters: FilterService,
      protected resize: ResizeService,
      private store: ApiStore) {
        
    }

    ngOnInit(){

      this.store.genres
        .debounceTime(650)
        //.combineLatest(this.resizeStream)
        .subscribe(genres=>{
          this.resizeChart();
          this.setupBubbles2(_.take(genres, 100));
      });
    }

    private resizeChart(){
      $('#chart').height($(window).height()- 100);
      $('#chart').width($(window).width()- 0);
    }

    private maxRadius: any;
    private padding: any;
    private year_centers: any;
    private all_center: any;
    private nodes: any;
    private force: any;
    private svg: any;

    setupBubbles2(genres){
        // if a resetup
        if(this.svg){
            d3.select('svg').remove();
        }

        var width = $('#chart').width(), height = $('#chart').height();

        this.svg = d3.select("#chart").append("svg")
            .attr('width', width)
            .attr('height', height);

        var max_amount = d3.max(genres, function (d) { return parseInt(d.count)})
        var radius_scale = d3.scale.pow().exponent(1).domain([0, max_amount]).range([20, 150])

        _.each(genres, elem=> {
          elem.radius = radius_scale(elem.count)*.4;
          elem.all = 'all';
          elem.x = _.random(0, width *.5 + width * .5);
          elem.y = _.random(0, height * .5 + height * .5);
        })

        this.padding = 10;
        this.maxRadius = d3.max(_.map(genres, g=> g.radius));

        this.year_centers = {
          "2008": {name:"2008", x: width/4, y: height/2},
          "2009": {name:"2009", x: width/4 * 2, y: height/2},
          "2010": {name:"2010", x: width/4 * 3, y: height/2}
        }

        this.all_center = { "all": {name:"All Genres", x: width/2, y: height/2}};

        this.nodes = this.svg.selectAll("circle")
          .data(genres);

        this.nodes.enter().append("circle")
          .attr("class", "node")
          .attr("cx", function (d) { return d.x; })
          .attr("cy", function (d) { return d.y; })
          .attr("r", 6)
          .style("cursor", "pointer")
          .style("fill", d => this.getFill(d))
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
            let genres = [d];
            this.filters.genres.next(genres);
            this.router.navigate(['artists']);
          })
          .on("mouseout", d=> { this.removePopovers(); })

        this.nodes.transition()
          .delay(500)
          .duration(1000)
          .ease('cubic-in-out')
          .attr("r", function (d) { return d.radius; })

        this.force = d3.layout.force();

        this.draw('all', genres);

        $( ".btn" ).click(function() {
          this.draw(this.id);
        });
  }


  getFill(d){
    let red = d.radius;
    red = d.radius * 255/150;
    red = Math.round(red);
    let color = Color('rgb(' + red + ',2,4)');
    color = color.lighten(2);
    return color.hex();
  }

  draw (varname, genres) {
          var foci = varname === "all" ? this.all_center: this.year_centers;
          this.force.on("tick", this.tick(foci, varname, genres));
          this.labels(foci);
          this.force.start();
  }

  tick (foci, varname, genres) {
          return e=> {
            for (var i = 0; i < genres.length; i++) {
              var genre = <any>genres[i];
              var f = foci[genre[varname]];
              if(f){
                genre.y += (f.y - genre.y) * e.alpha;
                genre.x += (f.x - genre.x) * e.alpha;
              }
            }
            this.nodes
              .each(this.collide(.18, genres))
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


   collide(alpha, genres) {
          var quadtree = d3.geom.quadtree(genres);
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
