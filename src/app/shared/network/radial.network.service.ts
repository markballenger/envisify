import { Injectable } from '@angular/core';
import { RadialPlacementService } from './radial.placement.service';

declare var d3;

@Injectable()
export class RadialNetworkService {

    width = 960;
    height = 800;
    allData: any = {};
    curLinksData = [];
    curNodesData = [];
    linkedByIndex = {};
    nodesG = null;
    linksG = null;
    node = null;
    link = null;
    layout = "force";
    filter = "all";
    sort = "songs";
    groupCenters = null;
    force = d3.layout.force();
    nodeColors = d3.scale.category20();
    //tooltip = Tooltip("vis-tooltip", 230);

    constructor(protected placement: RadialPlacementService){

    }


    //
    // 
    //
    charge(node) {
        return -Math.pow(node.radius, 2.0) / 2;
    }; 
    
    //
    // 
    //
    public start(selection, data) {
        var vis;
        this.allData = this.setupData(data);
        vis = d3.select(selection).append("svg").attr("width", this.width).attr("height", this.height);
        this.linksG = vis.append("g").attr("id", "links");
        this.nodesG = vis.append("g").attr("id", "nodes");
        this.force.size([this.width, this.height]);
        this.setLayout("force");
        this.setFilter("all");
        return this.update();
    };
    
    //
    // 
    //
    update() {
        var artists;
        this.curNodesData = this.filterNodes(this.allData.nodes);
        this.curLinksData = this.filterLinks(this.allData.links, this.curNodesData);
        debugger;
        console.log(this.allData);
        if (this.layout === "radial") {
            artists = this.sortedArtists(this.curNodesData, this.curLinksData);
            this.updateCenters(artists);
        }
        this.force.nodes(this.curNodesData);
        this.updateNodes();
        if (this.layout === "force") {
            this.force.links(this.curLinksData);
            this.updateLinks();
        } else {
            this.force.links([]);
            if (this.link) {
                this.link.data([]).exit().remove();
                this.link = null;
            }
        }
        return this.force.start();
    };
    
    //
    //
    //
    toggleLayout(newLayout) {
        this.force.stop();
        this.setLayout(newLayout);
        return this.update();
    };
    //
    // 
    //
    toggleFilter(newFilter) {
        this.force.stop();
        this.setFilter(newFilter);
        return this.update();
    };
    
    //
    // 
    //
    toggleSort(newSort) {
        this.force.stop();
        this.setSort(newSort);
        return this.update();
    };
    
    //
    // 
    //
    updateSearch(searchTerm) {
        var searchRegEx;
        searchRegEx = new RegExp(searchTerm.toLowerCase());
        return this.node.each(function(d) {
            var element, match;
            element = d3.select(this);
            match = d.name.toLowerCase().search(searchRegEx);
            if (searchTerm.length > 0 && match >= 0) {
                element.style("fill", "#F38630").style("stroke-width", 2.0).style("stroke", "#555");
                return d.searched = true;
            } else {
                d.searched = false;
                return element.style("fill", function(d) {
                    return this.nodeColors(d.artist);
                }).style("stroke-width", 1.0);
            }
        });
    };
    
    //
    // 
    //
    updateData = function(newData) {
        this.allData = this.setupData(newData);
        this.link.remove();
        this.node.remove();
        return this.update();
    };
    
    //
    // 
    //
    setupData = function(data) {
        var circleRadius, countExtent, nodesMap;
        countExtent = d3.extent(data.nodes, (d)=> {
            return d.radius; // todo: extract this from the service
        });
        circleRadius = d3.scale.sqrt().range([3, 12]).domain(countExtent);
        data.nodes.forEach(n=> {
            var randomnumber;
            n.x = randomnumber = Math.floor(Math.random() * this.width);
            n.y = randomnumber = Math.floor(Math.random() * this.height);
            return n.radius = circleRadius(n.radius);
        });
        nodesMap = this.mapNodes(data.nodes);
        // data.links.forEach(l=> {
        //     l.source = nodesMap.get(l.source);
        //     l.target = nodesMap.get(l.target);
        //     console.log(l);
        //     debugger;
        //     return this.linkedByIndex["" + l.source.id + "," + l.target.id] = 1;
        // });
        return data;
    };

    //
    // 
    //
    mapNodes(nodes) {
        let nodesMap = d3.map();
        nodes.forEach(n=> {
            return nodesMap.set(n.id, n);
        });
        return nodesMap;
    };

    //
    // nodeCounts
    //
    nodeCounts(nodes, attr) {
        var counts;
        counts = {};
        nodes.forEach(d=> {
            var _name;
            if (counts[_name = d[attr]] == null) {
                counts[_name] = 0;
            }
            return counts[d[attr]] += 1;
        });
        return counts;
    };

    //
    // neighboring
    //
    neighboring(a, b) {
        return this.linkedByIndex[a.id + "," + b.id] || this.linkedByIndex[b.id + "," + a.id];
    };

    //
    // filterNodes
    //
    filterNodes(allNodes) {
        var cutoff, filteredNodes, playcounts;
        filteredNodes = allNodes;
        if (this.filter === "popular" || this.filter === "obscure") {
            playcounts = allNodes.map(d=> {
                return d.playcount;
            }).sort(d3.ascending);
            cutoff = d3.quantile(playcounts, 0.5);
            filteredNodes = allNodes.filter(n=> {
                if (this.filter === "popular") {
                    return n.playcount > cutoff;
                } else if (this.filter === "obscure") {
                    return n.playcount <= cutoff;
                }
            });
        }
        return filteredNodes;
    };

    //
    // sortedArtists
    //
    sortedArtists(nodes, links) {
        var artists, counts;
        artists = [];
        if (this.sort === "links") {
            counts = {};
            links.forEach(l=> {
                var _name, _name1;
                if (counts[_name = l.source.artist] == null) {
                    counts[_name] = 0;
                }
                counts[l.source.artist] += 1;
                if (counts[_name1 = l.target.artist] == null) {
                    counts[_name1] = 0;
                }
                return counts[l.target.artist] += 1;
            });
            nodes.forEach(n=> {
                var _name;
                return counts[_name = n.artist] != null ? counts[_name = n.artist] : counts[_name] = 0;
            });
            artists = d3.entries(counts).sort((a, b)=> {
                return b.value - a.value;
            });
            artists = artists.map(v=> {
                return v.key;
            });
        } else {
            counts = this.nodeCounts(nodes, "artist");
            artists = d3.entries(counts).sort((a, b)=> {
                return b.value - a.value;
            });
            artists = artists.map(v=> {
                return v.key;
            });
        }
        return artists;
    };

    //
    // updateCenters
    //
    updateCenters(artists) {
        if (this.layout === "radial") {
            return this.groupCenters = this.placement.center({
                "x": this.width / 2,
                "y": this.height / 2 - 100
            }).radius(300).increment(18).keys(artists);
        }
    };

    //
    // filterLinks
    //
    filterLinks(allLinks, curNodes) {
        curNodes = this.mapNodes(curNodes);
        console.log(curNodes);
        debugger;
        return allLinks.filter(l=> {
            console.log(l);
            debugger;
            return curNodes.get(l.source) && curNodes.get(l.target);
        });
    };

    //
    // updateNodes
    //
    updateNodes() {
        console.log(this.curNodesData);
        this.node = this.nodesG.selectAll("circle.node").data(this.curNodesData, (d)=> {
            return d.id;
        });
        this.node.enter().append("circle").attr("class", "node").attr("cx", (d)=> {
            return d.x;
        }).attr("cy", (d)=> {
            return d.y;
        }).attr("r", (d)=> {
            return d.radius;
        }).style("fill", (d)=> {
            return this.nodeColors(d.artist);
        }).style("stroke", (d)=> {
            return this.strokeFor(d);
        }).style("stroke-width", 1.0);
        this.node.on("mouseover", this.showDetails).on("mouseout", this.hideDetails);
        return this.node.exit().remove();
    };

    //
    // updateLinks
    //
    updateLinks() {
        this.link = this.linksG.selectAll("line.link").data(this.curLinksData, (d)=> {
            return "" + d.source.id + "_" + d.target.id;
        });
        console.log(this.link);
        debugger;
        this.link.enter().append("line").attr("class", "link").attr("stroke", "#ddd").attr("stroke-opacity", 0.8).attr("x1", function(d) {
            return d.source.x;
        }).attr("y1", function(d) {
            return d.source.y;
        }).attr("x2", function(d) {
            return d.target.x;
        }).attr("y2", function(d) {
            return d.target.y;
        });
        return this.link.exit().remove();
    };

    //
    // setLayout
    //
    setLayout(newLayout) {
        this.layout = newLayout;
        if (this.layout === "force") {
            return this.force.on("tick", this.forceTick).charge(-200).linkDistance(50);
        } else if (this.layout === "radial") {
            return this.force.on("tick", this.radialTick).charge(this.charge);
        }
    };

    // 
    // setFilter
    //
    setFilter(newFilter) {
        return this.filter = newFilter;
    };
    
    //
    // setSort
    //
    setSort(newSort) {
        return this.sort = newSort;
    };

    //
    // forceTick
    //
    forceTick(e) {
        this.node
            .attr("cx", d=> d.x)
            .attr("cy", d=> d.y);

        return this.link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    };

    //
    // radialTick
    //
    radialTick(e) {
        this.node.each(this.moveToRadialLayout(e.alpha));
        this.node.attr("cx", function(d) {
            return d.x;
        }).attr("cy", function(d) {
            return d.y;
        });
        if (e.alpha < 0.03) {
            this.force.stop();
            return this.updateLinks();
        }
    };

    //
    // moveToRadialLayout
    //
    moveToRadialLayout(alpha) {
        var k;
        k = alpha * 0.1;
        return (d)=> {
            var centerNode;
            centerNode = this.groupCenters(d.artist);
            d.x += (centerNode.x - d.x) * k;
            return d.y += (centerNode.y - d.y) * k;
        };
    };

    // 
    // strokeFor
    //
    strokeFor(d) {
        return d3.rgb(this.nodeColors(d.artist)).darker().toString();
    };

    //
    // showDetails
    //
    showDetails(d, i) {
        var content;
        content = '<p class="main">' + d.name + '</span></p>';
        content += '<hr class="tooltip-hr">';
        content += '<p class="main">' + d.artist + '</span></p>';
        
        //this.tooltip.showTooltip(content, d3.event);
        
        if (this.link) {
            this.link.attr("stroke", (l)=> {
                if (l.source === d || l.target === d) {
                    return "#555";
                } else {
                    return "#ddd";
                }
            }).attr("stroke-opacity", (l)=> {
                if (l.source === d || l.target === d) {
                    return 1.0;
                } else {
                    return 0.5;
                }
            });
        }
        this.node.style("stroke", (n)=> {
            if (n.searched || this.neighboring(d, n)) {
                return "#555";
            } else {
                return this.strokeFor(n);
            }
        }).style("stroke-width", (n)=> {
            if (n.searched || this.neighboring(d, n)) {
                return 2.0;
            } else {
                return 1.0;
            }
        });
        return d3.select(this).style("stroke", "black").style("stroke-width", 2.0);
    };

    hideDetails(d, i) {
        
        //this.tooltip.hideTooltip();
        
        this.node.style("stroke", (n)=> {
            if (!n.searched) {
                return this.strokeFor(n);
            } else {
                return "#555";
            }
        }).style("stroke-width", (n)=> {
            if (!n.searched) {
                return 1.0;
            } else {
                return 2.0;
            }
        });
        if (this.link) {
            return this.link.attr("stroke", "#ddd").attr("stroke-opacity", 0.8);
        }
    };

}