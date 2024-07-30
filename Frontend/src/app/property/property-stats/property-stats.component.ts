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
import { HousingService } from '../../services/housing.service';

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
  public chartOptions: ChartOptions = {
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
      height: 1200,
      stacked: true,
      fontFamily: 'Roboto'
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

      align: "center",
      text: "Property Stats",
      style: {
        fontSize: "20px",
      }

    },
    xaxis: {
      categories: ["Pitesti", "Bucuresti", "Hunedoara", "Gaesti", "Cluj", "Timisoara", "Ploiesti"],
      labels: {
        formatter: function (val) {
          return val;
        },
        style: {
          fontSize: "20px",
          fontFamily: "Roboto"
        }
      },

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
      opacity: 1,
      colors: ['#007bff', '#00C853']
    },
    legend: {
      position: "top",
      fontSize: "20px",
      fontFamily: "Roboto",
      horizontalAlign: "left",
      width: 200,
      height: 50,
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toString();
      },
      style: { //Stil pentru data labels, scrisul de pe bar-uri
        fontSize: '15px',
        fontFamily: 'Roboto',
        colors: ['#fff']
      }
    }
  };
  cities: any;


  constructor(private housingService: HousingService) {

  }


  ngOnInit() {
    this.housingService.getAllCities().subscribe(data => {
      this.cities = data.map(city => city.name);
      console.log(this.cities);
      this.updateChartCategories();
    });

  }

  updateChartCategories() {
    if (this.cities && this.cities.length > 0) {
      this.chartOptions.xaxis = {
        categories: this.cities
      }


      const sellData = this.cities.map(() => Math.floor(Math.random() * 100));
      const rentData = this.cities.map(() => Math.floor(Math.random() * 100));

      this.chartOptions.series = [
        {
          name: "Sell",
          data: sellData
        },
        {
          name: "Rent",
          data: rentData
        }
      ];

      // Force chart update
      this.chartOptions = { ...this.chartOptions };
    }
  }
}