import {Chart} from 'chart.js';

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
        showTooltips: false,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        max: 10,
                        min: 0
                    }
                }]
            },
        },

        // The data for our dataset
        data: {
            labels: labels,
            datasets: [{
                label: 'Infected',
                backgroundColor: 'rgb(204,255,222)',
                borderColor: 'rgb(204,255,222)',
                data: []
            }]
        }
    });
    return chart;
}

export function addData(chart: Chart, label : number | string, data: number): void {
    //chart.data.labels.push(label);

    chart.data.datasets.forEach((dataset) => {
        if(dataset.data.length > graphXticks) {
            dataset.data.shift();
            dataset.data.pop();
        }
        dataset.data.push(data);
    });
    chart.update();
}

export function updateMaxY(chart: Chart, max: number): void {
    chart.options.scales.yAxes[0].ticks.max = Math.max(1,max);
}
