import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

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
            ]
        }
    ],
    labels: []
};


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
    }
      this.createChart();
      //createChart2();
    });
  }


  createChart() {
    //var ctx = document.getElementById('myChart').getContext('2d');
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
}

}