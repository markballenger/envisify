import { Component, OnInit } from '@angular/core';
import { ApiStore} from './../shared';
import { RadialNetworkService } from './../shared/network';
import { Artist } from './../models';
import { Observable } from 'rxjs';

declare var _;
declare var d3;
declare var $;

@Component({
    selector: 'related',
    templateUrl: './related.component.html',
    styleUrls: ['./related.component.scss']
})
export class RelatedComponent implements OnInit{

    public selectedArtist: Artist;
    public busy: boolean = true;
    constructor(protected store: ApiStore, protected network: RadialNetworkService){

    }

    ngOnInit(){
        this.store.allArtists
            .debounce(()=>Observable.timer(3000))
            .subscribe((artists: any)=>{
                if(artists && artists.length > 0){
                    this.network.start("#vis", this.getNodes(artists[0]));
                }
            });
    }

    
    private processRelated(nodes: any, sourceArtist: Artist, links: any[], group: number){
        _.each(_.take((<any>sourceArtist).relatedArtists, 25), relatedArtist=>{
            nodes.push(this.createNode(relatedArtist, 2));
            var artistIndex = _.indexOf(nodes, _.find(nodes, {id: sourceArtist.id}));
            var linkToIndex = _.indexOf(nodes, _.find(nodes, {id: relatedArtist.id}));
            var link = {source: artistIndex, target: linkToIndex, weight: 50};
            if(linkToIndex > -1)
                links.push(link);

            // recursion
            if(group <2){
                this.processRelated(nodes, relatedArtist, links, group);
            }
        });
    }

    
    private createNode(artist: Artist, group: number){
        return {
            id: artist.id,
            name: artist.name,
            radius: artist.popularity,
            img: this.getImage(artist),
            group: group
        };
    }

    private getImage(artist: Artist){
        if(!artist.images)
            return '';
        return artist.images.length > 1 ? artist.images[1].url : artist.images.length > 0 ? artist.images[0].url : '';
    }

    private getNodes(sourceArtist: Artist){
        let nodes = [this.createNode(sourceArtist, 1)];
        let links = [];
        _.each((<any>sourceArtist).relatedArtists, a=>{
            this.processRelated(nodes, sourceArtist, links, 2);
        });
        return {
            nodes: nodes,
            links: links
        }
    }

    public doLayout(newLayout: string){
        this.activate("layouts", newLayout);
        return this.network.toggleLayout(newLayout);
    }

    public doFilter(newFilter: string){
        this.activate("filters", newFilter);
        return this.network.toggleFilter(newFilter);
    }

    public doSort(newSort: string){
        this.activate("sorts", newSort);
        return this.network.toggleSort(newSort);
    }

    public artistSelected(artists: Artist[]){
        if(artists && artists.length > 0){
            let nodes = this.getNodes(artists[0]);
            return this.network.updateData(nodes);
        }
    }

    public doSearch(searchTerm: string){
        return this.network.updateSearch(searchTerm);
    }


    //
    //
    //
    activate(group, link) {
        d3.selectAll("#" + group + " a").classed("active", false);
        return d3.select("#" + group + " #" + link).classed("active", true);
    };
    
};
