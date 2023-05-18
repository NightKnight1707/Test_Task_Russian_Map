import React, {useEffect, useRef} from "react";
import * as d3 from "d3";
import {geoPath} from "d3-geo";
import ua from './ua.json';
import countries from './countries.json';
import * as topojson from "topojson-client";

const contestedRegions = ["Mariupol", "Donetsk", "Crimea", "Luhansk", "Luhans'k", "Donets'k", "Sevastopol'", "Zaporizhzhya", "Kherson"];

export const RussiaMap2 = () => {
  const h = 700;
  const w = 1400;
  const projection = d3.geoMercator().translate([w/2, h/2]).scale(2000).center([0,40]);
  const path = geoPath().projection(projection);
  const geojson = topojson.feature(ua, ua.objects.UKR_adm1);
  const values = [countries]
  const f = () => {
    const svg = d3.create("svg")
      .style("background-color", "#BEBEBE")
      .attr("viewBox", "1000 -500 1800 1000")
      .attr("stroke", "#aaa")
      .attr("stroke-width", "1")
      .attr("fill", "white")
      .style("cursor", "crosshair")
      .classed("svg-content", true);

    const g = svg.append("g")
      .attr("class", "circles");

    g.selectAll("path")
      .data(values[0].features.concat(geojson.features))
      .enter()
      .append("path")
      .attr("class","continent")
      .attr("d", path)
      .attr("fill", function(d) {
        if('NAME_1' in d.properties && contestedRegions.includes(d.properties['NAME_1'])){
          return "#10BD37"
        }else if(d.id === "RU"){
          return "#cc5839"
        }else{
          return "#e2d663"
        }
      })


    return svg.node();
  }

  const d = f();

  const svg = useRef(null);
  useEffect(()=>{
    if(svg.current){
      svg.current.appendChild(d)
    }
  }, []);


    return (
        <div>
          <div ref={svg}/>
        </div>
    );
}
