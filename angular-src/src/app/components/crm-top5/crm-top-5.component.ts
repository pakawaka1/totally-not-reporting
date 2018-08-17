import { Component, OnInit } from '@angular/core';
import { CRMDataService } from '../../services/crm.data.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-crm-top5',
    templateUrl: './crm-top-5.component.html',
    styleUrls: [ './crm-top-5.component.scss' ]
})

export class CRMTop5Component implements OnInit {

    private clientList = [];
    public top5Shares;
    public top5Credit;
    public top5Acquisition;
    public top5Secured;
    public top5Unsecured;
    public top5NumberAuto;
    public top5PriceAuto;

    // bar options
    public barData;
    public barDataTwo;
    public barShowXAxis = true;
    public barShowYAxis = true;
    public barGradient = true;
    public barShowLegend = false;
    public barShowXAxisLabel = true;
    public barXAxisLabel = 'Company';
    public barShowYAxisLabel = true;
    public barYAxisLabel = 'Total Shares';
    public barColorScheme = {
       domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
     };

     // bar 2 options
    public bar2Data;
    public bar2DataTwo;
    public bar2ShowXAxis = true;
    public bar2ShowYAxis = true;
    public bar2Gradient = true;
    public bar2ShowLegend = false;
    public bar2ShowXAxisLabel = true;
    public bar2XAxisLabel = 'Company';
    public bar2ShowYAxisLabel = true;
    public bar2YAxisLabel = '';
    public bar2ColorScheme = {
       domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
     };

     // line options
    public lineData;
    public lineDataTwo;
    public lineShowXAxis = true;
    public lineShowYAxis = true;
    public lineGradient = true;
    public lineShowLegend = false;
    public lineShowXAxisLabel = true;
    public lineXAxisLabel = 'Penetration Ratio';
    public lineShowYAxisLabel = true;
    public lineYAxisLabel = 'Total Shares';
    public lineColorScheme = {
       domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
      };

     // scatterplot options
    public plotData: any;
    public plotView: any[] = [700, 400];
    public plotShowXAxis = true;
    public plotShowYAxis = true;
    public plotShowXAxisLabel = true;
    public plotShowYAxisLabel = true;
    public xAxisLabel = 'Number of Loans';
    public showYAxisLabel = true;
    public yAxisLabel = 'Total dollar amount of loans';
    public y2AxisLabel = 'Count';

  constructor(private _crm: CRMDataService, private _router: Router) {}

    ngOnInit(): void {
        this._crm.getClientsAndAccounts().subscribe(list => {
            this.clientList = list.result;
            this._initTop5(this.clientList);
        });
    }

    private _initTop5(list: any[]) {
        list = this._sortList(list, 'total_shares');
        this.top5Shares = list.slice(0, 5);
        this._prepareSharesBarData(this.top5Shares);

        list = this._sortList(list, 'line_of_credit');
        this.top5Credit = list.slice(0, 5);
        this._prepareCreditBarData(this.top5Credit);

        list = this._sortList(list, 'penetration_ratio');
        this.top5Acquisition = list.slice(0, 5);
        this._prepareAcquisitionLineData(this.top5Acquisition);

        list = this._sortList(list, 'total_shares');
        this.top5Shares = list.slice(0, 5);
        this._prepareAcquisitionLineData(this.top5Shares);



        list = this._sortList(list, 'price');
        this.top5PriceAuto = list.slice(0, 5);
        this._prepareAutoData(this.top5PriceAuto);
    }

    private _sortList(list: any[], category: string) {
        list.sort( (a, b) => b[category] - a[category]);
        return list;
    }

    private _prepareSharesBarData(top5Client: any[]) {
        this.barData = [];
        for (const client of top5Client) {
            const barObj = {
                name: client.client_name,
                value: client.total_shares
            };
            this.barData.push(barObj);
        }
    }

    private _prepareCreditBarData(top5Client: any[]) {
      this.bar2Data = [];
      for (const client of top5Client) {
          const barObj = {
              name: client.client_name,
              value: client.line_of_credit
          };
          this.bar2Data.push(barObj);
        }
    }

    private _prepareAcquisitionLineData(top5Client: any[]) {
      this.lineData = [{
                name: '',
                series: []
            }];
      for (const client of top5Client) {
          let lineObj = {
                name: client.client_name,
                value: client.penetration_ratio,
            };
            this.lineData[0]['series'].push(lineObj);
        }
    }

    private _prepareAutoData(top5Client: any[]) {
        this.plotData = [];
        for (const client of top5Client) {
            const plotObj = {
                name: client.client_name,
                series: [
                    {
                        name: client.client_name,
                        x: Math.ceil((Math.random() * 10)),
                        y: JSON.parse(client.auto),
                        r: 1
                    }
                ]
            }
                
        this.plotData.push(plotObj);
        }
    }

    public millions(num: number): string {
        if (typeof num !== 'number') {
            if (num['value']) { num = num['value']}
            else if (num['cell']) { num = num['cell']['value']}
        } // account for the graphs not passing a number
        if(num < 1000000000) {
            return '$' + Math.round(num * 10 / 1000000) / 10 + 'm';
        } else {
            return '$' + Math.round(num * 10 / 1000000000) / 10 + 'b';
        }
    }

    public onSelect(event: any) {
        const destinationClient = this.clientList.filter( client => client.client_name === event.name)[0].client_id;
        this._router.navigate(['../../crm/detail', destinationClient]);
    }
}

