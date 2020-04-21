import {Chart} from 'chart.js';

export function loadChart(): Chart {
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("population-chart");
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    let chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 1, 2, 4, 8, 16, 32, 64, 43, 17]
            }]
        },
        // Configuration options go here
        options: {}
    });
    let plot_button = document.getElementById('plot-button');
    plot_button.onclick = () => {
        addData(chart, 13, Math.round(Math.random()*13+1))
    };

    function addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }
    return chart;
}
