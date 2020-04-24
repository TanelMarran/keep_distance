import {Chart, ChartDataSets} from 'chart.js';
import {Colors} from "./main";

const graphXticks = 30*6;
let labels = [];
for (var i = 0; i < graphXticks; i++) {
    labels.push('');
}

export function loadChart(): Chart {
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("population-chart");
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    let chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        max: 10,
                        min: 0
                    }
                }]
            },
            elements: {
                point: {
                    radius: 0,
                    hitRadius: 0,
                    hoverRadius: 0,
                }
            }
        },

        // The data for our dataset
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Infected',
                    backgroundColor: Colors.infected,
                    borderColor: Colors.infected,
                    data: []
                },
                {
                    label: 'Healthy',
                    backgroundColor: Colors.healthy,
                    borderColor: Colors.healthy,
                    data: []
                },
                {
                    label: 'Recovered',
                    backgroundColor: Colors.recovered,
                    borderColor: Colors.recovered,
                    data: []
                }
            ]
        }
    });
    return chart;
}

export function addData(chart: Chart, label : number | string, data: [number, number, number]): void {
    for(let i = 1; i < data.length; i++) {
        data[i] += data[i-1];
    }

    for(let i = 0; i < chart.data.datasets.length; i++) {
        let dataset: ChartDataSets = chart.data.datasets[i];
        if(dataset.data.length > graphXticks) {
            dataset.data.shift();
            dataset.data.pop();
        }
        dataset.data.push(data[i]);
    }

    /*chart.data.datasets.forEach((dataset) => {
        if(dataset.data.length > graphXticks) {
            dataset.data.shift();
            dataset.data.pop();
        }
        dataset.data.push(data);
    });*/
    chart.update();
}

export function updateMaxY(chart: Chart, max: number): void {
    chart.options.scales.yAxes[0].ticks.max = Math.max(1,max);
}
