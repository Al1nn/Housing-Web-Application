import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexFill,
  ApexLegend,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: 'app-property-stats',
  templateUrl: './property-stats.component.html',
  styleUrls: ['./property-stats.component.css']
})
export class PropertyStatsComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Sell",
          data: [44, 55, 41, 37, 22, 43, 21]
        },
        {
          name: "Rent",
          data: [53, 32, 33, 52, 13, 43, 32]
        },
      ],
      chart: {
        type: "bar",
        height: 500,
        stacked: true
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      title: {
        text: "Property Stats",

      },
      xaxis: {
        categories: ["Pitesti", "Bucuresti", "Hunedoara", "Gaesti", "Cluj", "Timisoara", "Ploiesti"],
        labels: {
          formatter: function (val) {
            return val;
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toString();
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        offsetX: 40,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toString();
        },
        style: { //Styling for data labels
          fontSize: '15px',
          colors: ['#fff']
        }
      }
    };
  }

  ngOnInit() {
  }
}