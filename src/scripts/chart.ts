import {Chart} from 'chart.js';

export function loadChart(): Chart {
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("population-chart");
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    let chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: [],
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgb(204,255,222)',
                borderColor: 'rgb(204,255,222)',
                data: []
            }]
        },
        // Configuration options go here
        options: {}
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
        dataset.data.push(data);
    });
    chart.update();
}
