import React, {useEffect, useState} from "react";
import geoJson from './russia.json';
import {geoAlbers, geoPath} from "d3-geo";
import {select} from "d3-selection";
import * as topojson from "topojson";
import ua from './ua.json';
import Papa from "papaparse";
import axios from "axios";
import './russ.css';

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function color ()  {
  return '#'+Math.floor(Math.random() * Math.pow(2,32) ^ 0xffffff).toString(16).substr(-6)
}

async function regNameFun() {
  const file = await axios.get('regName.csv')
  let csv = [];
  Papa.parse(file.data,{
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      csv = results.data;
    },
  })
  const res = {};
  csv.forEach((d) => {
    res[d.RegionCode] = d.RegionName;
  });
  return res;
}

const tooltip = select("body").append("div")
  .attr("class", "leaflet-top leaflet-right")
  .attr("class", "tooltip");


export const Russ4 = () =>{
  const width = 1200;
  const height = width * 0.5;
  const projection =  geoAlbers()
    .rotate([-105, 0])
    .center([-10, 65])
    .parallels([52, 64])
    .scale(700)
    .translate([width / 2, height / 2]);

  const path = geoPath().projection(projection);
  const data = topojson.feature(geoJson, geoJson.objects.russia).features
  const [reg, setReg] = useState([]);
  useEffect( ()=>{
    async function fetchData() {
      setReg(await regNameFun())
    }
    void fetchData();
  }, [])
  const [russ] = useState([...data, ...ua])
  return (
    <div>
      <svg width={width} height={height}>
        <g className="geojson-layer">
          {
            russ.map(d => (
              <path
                key={uuidv4()}
                d={path(d)}
                fill={color()}
                stroke="#0e1724"
                strokeWidth="1"
                strokeOpacity="0.5"
                opacity={"0.4"}
                onMouseOver={(e) => {
                  select(e.target).transition().duration(300).style("opacity", 1);
                  tooltip.text(reg[d.properties.region])
                    .style("left", (e.pageX) + "px")
                    .style("top", (e.pageY -30) + "px");
                }}
                onMouseOut={(e) => {
                  select(e.target).transition().duration(300)
                    .style("opacity", 0.4);
                  tooltip.transition().duration(300)
                    .style("opacity", 1);
                }}
              />
            ))
          }
        </g>
      </svg>
    </div>
    );
};


