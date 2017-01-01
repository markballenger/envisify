import { Component, OnInit} from '@angular/core';
import { ApiService } from './../shared';
import { Artist, Genre } from './../models';

declare var d3: any;
declare var _: any;

@Component({
  selector: 'bubble', 
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss'],
})
export class BubbleComponent implements OnInit {

    artists : Artist[];
    genres: Genre[];

    constructor(private api: ApiService) {
        // Do something with api
    }

    ngOnInit(){

        if(!this.artists){

            // start with an empty array
            this.artists = new Array<Artist>();
            this.genres = new Array<Genre>();

            // subscribe and wait for the return
            this.api.getAllArtists()
                .subscribe((artists: Artist[])=>{
                    this.artists = this.artists.concat(artists);
                    this.populateGenres();
                    this.setupBubbles();
            });
        }

    }

    //
    // sets up the d3 svg
    //
    setupBubbles(){
        var svg = d3.select("svg"),
            width = +svg.attr("width");

        var format = d3.format(",d");

        var color = d3.scaleOrdinal(d3.schemeCategory20c);

        var pack = d3.pack()
            .size([width, width])
            .padding(1.5);

        var root = d3.hierarchy({children: this.genres})
            .sum(function(d) { return d.value; })
            .each(function(d) {
                if (id = d.data.id) {
                var id, i = id.lastIndexOf(".");
                d.id = id;
                d.package = id.slice(0, i);
                d.class = id.slice(i + 1);
                }
            });

        var node = svg.selectAll(".node")
            .data(pack(root).leaves())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("circle")
            .attr("id", function(d) { return d.id; })
            .attr("r", function(d) { return d.r; })
            .style("fill", function(d) { return color(d.package); });

        node.append("clipPath")
            .attr("id", function(d) { return "clip-" + d.id; })
            .append("use")
            .attr("xlink:href", function(d) { return "#" + d.id; });

        node.append("text")
            .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
            .selectAll("tspan")
            .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
            .enter().append("tspan")
            .attr("x", 0)
            .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
            .text(function(d) { return d; });

        node.append("title")
            .text(function(d) { return d.id + "\n" + format(d.value); });

    }


    //
    // populateGenres
    //
    populateGenres(){
        _.each(this.artists, a=>{
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
