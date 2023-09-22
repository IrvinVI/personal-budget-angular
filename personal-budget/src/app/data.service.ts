import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map} from 'rxjs/operators'
import { BudgetModel } from './budget.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  budgetData:BudgetModel[] = [];
  dataUrl = 'http://localhost:3000/budget';
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


  constructor(private http: HttpClient) { }


  fetchData():Observable<BudgetModel[]>{
    return this.http.get<BudgetModel[]>(this.dataUrl)
  }



  public fetchData2(){
    this.http.get<BudgetModel[]>(this.dataUrl)
    .subscribe(
      data => {
        this.budgetData = data;
      }
    );
  }

  getBudgetsSize(): any{
    return this.budgetData.length;
  }

  getBudgets(): BudgetModel[] {
    return this.budgetData;
  }

  // getData():Observable<any>{
  //   //   this.http.get('http://localhost:3000/budget')
  //   //   .subscribe((res: any) => {
  //   //     for (var i = 0; i < res.myBudget.length; i++) {
  //   //       this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
  //   //       this.dataSource.labels[i] = res.myBudget[i].title;
  //   //     }
  //   //     console.log(this.dataSource);
  //   //   });

  //   // return of(this.dataSource);
  //   return this.http.get('http://localhost:3000/budget').pipe
  //   (
  //     tap((responseData)=>{
  //       this.chartData = responseData;
  //     })
  //   );

  //   // return of(this.chartData);
  // }



}
