import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexStroke,
    ApexTooltip,
    ApexFill,
    ApexLegend,
} from 'ngx-apexcharts';
import { HousingService } from '../../services/housing.service';
import { IPropertyStats } from '../../model/IPropertyStats.interface';
import { isPlatformBrowser } from '@angular/common';



export interface ChartOptions {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
    fill: ApexFill;
    legend: ApexLegend;
}

@Component({
    selector: 'app-property-stats',
    templateUrl: './property-stats.component.html',
    styleUrls: ['./property-stats.component.css'],
})
export class PropertyStatsComponent implements OnInit {





    @ViewChild('chart') chart: ChartComponent;
    public chartOptions: ChartOptions;
    propertyStats: IPropertyStats[];


    constructor(private housingService: HousingService,
        @Inject(PLATFORM_ID) private platformId: Object) {
        // Initialize chartOptions conditionally
        if (isPlatformBrowser(this.platformId)) {
            this.chartOptions = {
                series: [
                    {
                        name: 'Sell',
                        data: [44, 55, 41, 37, 22, 43, 21]
                    },
                    {
                        name: 'Rent',
                        data: [53, 32, 33, 52, 13, 43, 32]
                    },
                ],
                chart: {
                    type: 'bar',
                    height: 1200,
                    stacked: true,
                    fontFamily: 'Roboto'
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: '30px',
                        borderRadius: 5
                    }
                },
                stroke: {
                    width: 1,
                    colors: ['#fff'],
                },
                xaxis: {
                    categories: ['Pitesti', 'Bucuresti', 'Hunedoara', 'Gaesti', 'Cluj', 'Timisoara', 'Ploiesti'],
                    labels: {
                        formatter: function (val) {
                            return val;
                        },
                    },
                },
                yaxis: {
                    title: {
                        text: undefined,
                    },
                    labels: {
                        formatter: function (val) {
                            return val.toString();
                        },
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
                    position: 'top',
                    fontSize: '20px',
                    fontFamily: 'Roboto',
                    horizontalAlign: 'center',
                    width: 200,
                    height: 50,
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val.toString();
                    },
                    style: { // Style for data labels, text on bars
                        fontSize: '15px',
                        fontFamily: 'Roboto',
                        colors: ['#fff'],
                    }
                }
            };
        }
    }


    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {

            this.housingService.getAllPropertyStats().subscribe(data => {
                this.propertyStats = data;
                this.updateChartCategories();
            });
        }


    }

    updateChartCategories() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.propertyStats && this.propertyStats.length > 0) {



                this.chartOptions.xaxis = {
                    ...this.chartOptions.xaxis,
                    categories: this.propertyStats.map(stats => `${stats.city}, ${stats.country}`),
                    labels: {
                        ...this.chartOptions.xaxis.labels,
                        style: {
                            fontFamily: 'Roboto',
                            fontSize: '1rem'
                        }
                    }
                };

                this.chartOptions.yaxis = {
                    ...this.chartOptions.yaxis,
                    labels: {
                        ...this.chartOptions.yaxis.labels,
                        style: {
                            fontFamily: 'Roboto',
                            fontSize: '12px',

                        }
                    }
                };


                const sellData = this.propertyStats.map(stats => stats.sellCount);
                const rentData = this.propertyStats.map(stats => stats.rentCount);

                this.chartOptions.series = [
                    {
                        name: 'Sell',
                        data: sellData
                    },
                    {
                        name: 'Rent',
                        data: rentData
                    }
                ];

                // Force chart update
                this.chartOptions = { ...this.chartOptions };
            }
        }

    }
}
