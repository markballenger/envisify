import { Component, OnInit } from '@angular/core';
import { ApiStore } from './../shared';
import { Artist, Genre } from './../models';
import { Observable, Subject } from 'rxjs';
import { RadialPlacementService } from './../shared/network';

declare var $ : any;
declare var d3 : any;
declare var _ : any;

@Component({
    selector: 'network',
    templateUrl: './network.component.html',
    styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {

    // the d3 data obj
    private data : any = { nodes: [], links: []};
    private svg: any;
    private force: any = d3.layout.force();

    public width: number = 960;
    public height: number = 500;
    public gravity: number = .25;
    public distance: number = 200;
    public charge: number = -1000;
    public imageRadius: number = 50;

    public relatedPerArtistCount = 10;

    public d3Stream: Subject<number> = new Subject();
    public related: Subject<Artist[]> = new Subject();
    public networkStream: Subject<Artist> = new Subject();

    constructor(protected store : ApiStore){

        
    }

    ngOnInit(){

        this.width=window.innerWidth - $('.col-md-3').width();
        this.height=window.innerHeight - 200;

        // update d3 on setting changes
        this.d3Stream
            .debounce(x=>Observable.timer(500))
            .subscribe(x=> {
                this.setupD3();
                this.setupSvg();
            });

        
        this.networkStream
            .subscribe((artist: Artist)=>{

                // do one artist at a time for now  
                this.data.nodes = [];
                this.data.links = [];

                // map the first layer of artists
                if(!_.some(this.data.nodes, {id: artist.id}))
                    this.data.nodes.push(this.createNode(artist));

                // we have a node, init
                this.setupD3();
                this.setupSvg();

                // get the first round of related
                this.subscribeRelated(artist);
            });

        this.store.artistsFiltered
            //.debounce(()=>Observable.timer(1000))
            .subscribe((artists: Artist[])=>{
                
                // for now, only support 1 artist at a time
                if(artists && artists.length)
                    this.networkStream.next(artists[0]);
            });


    }

    private hasMatchingGenres(genreListA: string[], genreListB: string[]) : boolean{
        let similar = _.intersection(genreListA, genreListB);
        if(similar.length > 0)
        return similar.length > 0;
    }

    //
    // processRelated: adds nodes and links for the top 25 related artists
    //   based on the given source artist
    //
    private subscribeRelated(sourceArtist: Artist){
        // stop the layout to add nodes
        this.force.stop();

        // subscribe to our related stream
        sourceArtist.relatedArtists
            .zip(this.store.allArtists, (x, y)=> { 
                return{
                    'relatedArtists': x,
                    'allArtists': y
                };
            })
            .map(x=> { 
                _.each(x.relatedArtists, r=> {
                    r.existsInLibrary = _.some(x.allArtists, {id: r.id});
                });
                //return _.filter(x.relatedArtists, {existsInLibrary: false});
                return x.relatedArtists;
            })
            
            // have to setup svg styles for the new nodes
            .finally(()=> this.setupSvg()) 

            .subscribe(relatedArtists=>{
                this.loadRelated(relatedArtists, sourceArtist);
        });
    }   

    //
    // loadRelated
    //
    private loadRelated(relatedArtists : Artist[], sourceArtist: Artist){
        // only take so many related artsits at a time
        relatedArtists = _.take(relatedArtists, this.relatedPerArtistCount);
        this.related.next(relatedArtists);
        var artistIndex = _.indexOf(this.data.nodes, _.find(this.data.nodes, {id: sourceArtist.id}));
        _.each(relatedArtists, relatedArtist=>{
                let n = _.find(this.data.nodes, {id: relatedArtist.id});
                if(!n)
                    this.data.nodes.push(this.createNode(relatedArtist));
                var linkToIndex = _.indexOf(this.data.nodes, _.find(this.data.nodes, {id: relatedArtist.id}));
                var link = {source: artistIndex, target: linkToIndex, weight: 50};

                if(linkToIndex > -1 && linkToIndex != artistIndex)
                    this.data.links.push(link);
        });
    }

    //
    // createNode: creates a node based on an artist
    //
    private createNode(artist: any){
        return {
            id: artist.id,
            name: artist.name,
            img: artist.img || this.getImage(artist),
            group: 1,
            genres: artist.genres,
            popularity: artist.popularity,
            relatedArtists: artist.relatedArtists,
            existsInLibrary: artist.existsInLibrary
        };
    }

    //
    // getImage: gets the best image possible for display on this view
    //
    private getImage(artist: Artist){
        if(!artist.images)
            return '';
        return artist.images[0].url;
        //return artist.images.length > 1 ? artist.images[1].url : artist.images.length > 0 ? artist.images[0].url : '';
    }


    //
    // setupD3: sets up the d3 svg, to be called once at startup once we've added a node
    //
    private setupD3(){

        // if a resetup
        if(this.svg){
            d3.select('svg').remove();
        }

        this.svg = d3.select('#network').append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        this.svg.selectAll('*').remove();

        this.force.on('tick', ()=> {
            this.data.nodes[0].x = this.width / 2;
            this.data.nodes[0].y = this.height / 2;
            
            this.svg.selectAll('.link')
                .attr('x1', d=> d.source.x)
                .attr('y1', d=> d.source.y)
                .attr('x2', d=> d.target.x)
                .attr('y2', d=> d.target.y);
            this.svg.selectAll('.node')
                .attr('transform', d=> 'translate(' + d.x + ',' + d.y + ')');
        });

        this.force.gravity(this.gravity)
            .distance(this.distance)
            .charge(this.charge)
            .size([this.width, this.height])
            .nodes(this.data.nodes)
            .links(this.data.links)
            ;//.start();
    }

    // 
    // setupSvg: to be called everytime new nodes are added to style them
    // 
    setupSvg(){

        this.svg.selectAll('*').remove();

        var link = this.svg.selectAll('.link')
            .data(this.data.links) 
            .enter().append('line')
            .attr('class', 'link')
            .style('stroke-width', d=> Math.sqrt(d.weight));
        
        var node = this.svg.selectAll('.node')
            .data(this.data.nodes)
            .enter().append('g')
            .attr('class', 'node')
            .call(this.force.drag);

        node.append('defs')
            .append('pattern')
                .attr('id', function(d) { return (d.id+'-icon');})
                .attr('width', 1)
                .attr('height', 1)
                .attr('patternContentUnits', 'objectBoundingBox')
            .append('svg:image')
                .attr('xlink:xlink:href', function(d) { return (d.img);})
                .attr('height', 1)
                .attr('width', 1)
                .attr('preserveAspectRatio', 'xMinYMin slice');
        
        var images = node.append('circle')
                //.attr("class", "logo")
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('r', d=>d.popularity)
                .style('stroke-width', '4px')
                .style('fill', 'transparent')       // this code works OK
                .style('stroke', d=> d.existsInLibrary===true ? 'limegreen' : 'red')
                .style('fill', d=> 'url(#' + d.id + '-icon)');
        
        // make the image grow a little on mouse
        // over and add the text details on click
        let imageRadius = this.imageRadius;
        var setEvents = images
                // Append hero text
                .on( 'click', d=>
                {
                    this.removePopovers();
                    //this.subscribeRelated(d);
                    this.networkStream.next(d);
                })

                .on( 'mouseenter', function(d) {
                    // select element in current context
                    d3.select(this)
                    .transition()
                    .attr('x', d=> imageRadius * -3)
                    .attr('y', d=> imageRadius * -3)
                    .attr('r', r=> imageRadius * 1.5)
                    .attr('height', 300)
                    .attr('width', 300)
                    ;

                    $(this).popover({
                        placement: 'auto top',
                        container: 'body',
                        trigger: 'manual',
                        html : true,
                        content: function() {
                        return d.name; }
                    });
                    $(this).popover('show');
                })
                // set back
                .on( 'mouseleave', function() {
                    d3.select( this )
                    .transition()
                    .attr('x', d=> imageRadius * -3)
                    .attr('y', d=> imageRadius * -3)
                    .attr('r', r=> r.popularity)
                    .attr('height', 50)
                    .attr('width', 50);
                })
                .on('mouseout', d=> this.removePopovers());
        
        this.force.start();
        
        // this calms down the d3 initial intro, must be after start
        var k = 0;
        while ((this.force.alpha() > 1e-2) && (k < 50)) {
            this.force.tick(),
            k = k + 1;
        }
    }


   removePopovers () {
        $('.popover').each(function(){ $(this).remove(); });
    }
}