import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { Chart } from 'chart.js';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { BudgetModel } from '../budget.model';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  providers:[DataService]
})
export class HomepageComponent implements OnInit {

  public budgets:BudgetModel[];
  public dataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
                '#1D8348',
                '#7D3C98',
                '#E74C3C',
            ],
            backend: ''
        }
    ],
    labels: []
  };


  constructor(private http: HttpClient, public dataService: DataService) { }



  ngOnInit(): void {

    if(this.dataSource.datasets[0].data.length == 0){
        this.dataService.fetchData().subscribe(
          data=>{
            this.budgets = data
            for (var i = 0; i < this.budgets.length; i++) {
                this.dataSource.datasets[0].data[i] = this.budgets[i].budget;
                this.dataSource.labels[i] = this.budgets[i].title;
              }
            this.createChart();
            this.createChart2();
          }
        );
    }

    // if(this.dataService.getBudgetsSize() == 0){
    //   this.dataService.fetchData2();
    //   this.budgets = this.dataService.getBudgets();
    //   for (var i = 0; i < this.budgets.length; i++) {
    //     this.dataSource.datasets[0].data[i] = this.budgets[i].budget;
    //     this.dataSource.labels[i] = this.budgets[i].title;
    //   }
    //   this.createChart();
    //   this.createChart2();
    // }

    // this.http.get('http://localhost:3000/budget')
    // .subscribe((res: any) => {
    //   for (var i = 0; i < res.myBudget.length; i++) {
    //     this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
    //     this.dataSource.labels[i] = res.myBudget[i].title;
    //   }
    //   this.createChart();
    //   this.createChart2();
    // });
  }


  createChart() {
    //var ctx = document.getElementById('myChart').getContext('2d');
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
  }



 createChart2(){

  var nums = this.dataSource.datasets[0].data;

  var svg = d3.select("#myChart2")
      .append("svg")
      .append("g")

  svg.append("g")
      .attr("class", "slices");
  svg.append("g")
      .attr("class", "labels");
  svg.append("g")
      .attr("class", "lines");

  var width = 200,
      height = 200,
      radius = Math.min(width, height) / 2;

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
          return d.value;
      });



  var arc = d3.svg.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

  var outerArc = d3.svg.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

  svg.attr("transform", "translate(" + width / 1 + "," + height / 1 + ")");

  var key = function(d){ return d.data.label; };

  var color = d3.scale.ordinal()
      .domain(this.dataSource.labels)
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);




  function randomData (){
      var labels = color.domain();
      return labels.map(function(label){
          return { label: label, value: (nums[labels.indexOf(label)]) }
      });
  }


  change(randomData());


  function change(data) {

      /* ------- PIE SLICES -------*/
      var slice = svg.select(".slices").selectAll("path.slice")
          .data(pie(data), key);

      slice.enter()
          .insert("path")
          .style("fill", function(d) { return color(d.data.label); })
          .attr("class", "slice");

      slice
          .transition().duration(1000)
          .attrTween("d", function(d) {
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                  return arc(interpolate(t));
              };
          })

      slice.exit()
          .remove();

      /* ------- TEXT LABELS -------*/

      var text = svg.select(".labels").selectAll("text")
          .data(pie(data), key);

      text.enter()
          .append("text")
          .attr("dy", ".35em")
          .text(function(d) {
              return d.data.label;
          });

      function midAngle(d){
          return d.startAngle + (d.endAngle - d.startAngle)/2;
      }

      text.transition().duration(1000)
          .attrTween("transform", function(d) {
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                  var d2 = interpolate(t);
                  var pos = outerArc.centroid(d2);
                  pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                  return "translate("+ pos +")";
              };
          })
          .styleTween("text-anchor", function(d){
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                  var d2 = interpolate(t);
                  return midAngle(d2) < Math.PI ? "start":"end";
              };
          });

      text.exit()
          .remove();

      /* ------- SLICE TO TEXT POLYLINES -------*/

      var polyline = svg.select(".lines").selectAll("polyline")
          .data(pie(data), key);

      polyline.enter()
          .append("polyline");

      polyline.transition().duration(1000)
          .attrTween("points", function(d){
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                  var d2 = interpolate(t);
                  var pos = outerArc.centroid(d2);
                  pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                  return [arc.centroid(d2), outerArc.centroid(d2), pos];
              };
          });

      polyline.exit()
          .remove();
  };

  }



}
