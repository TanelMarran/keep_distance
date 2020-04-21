import {Chart} from 'chart.js';

const graphXticks = 10;

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
        },

        // The data for our dataset
        data: {
            labels: [],
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgb(204,255,222)',
                borderColor: 'rgb(204,255,222)',
                data: []
            }]
        }
    });
    let plot_button = document.getElementById('plot-button');
    plot_button.onclick = () => {
        addData(chart, 13, Math.round(Math.random()*13+1))
    };
    return chart;
}

export function addData(chart: Chart, label : number | string, data: number): void {
    chart.data.labels.push(label);

    chart.data.datasets.forEach((dataset) => {
        if(dataset.data.length >= graphXticks) {
            chart.data.labels.shift();
            chart.data.labels.pop();
            dataset.data.shift();
            dataset.data.pop();
        }
        dataset.data.push(data);
    });
    chart.update();
}
