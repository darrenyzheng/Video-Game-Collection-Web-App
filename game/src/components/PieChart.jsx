import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js"

ChartJS.register(Tooltip, Legend, ArcElement);

const PieChart = ({ conditions, totalGames, title  }) => {
    // Data to be represented in the pie chart
    let randomColors = [];

    for (let i of conditions) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const a = 0.5;
        randomColors.push(`rgba(${r}, ${g}, ${b}, ${a})`);
    };

    const data = {
        labels: Array.from(conditions.keys()),
        datasets: [
            {
                data: Array.from(conditions.values()),
                backgroundColor: randomColors
                ,
                borderColor: randomColors
                ,
                borderWidth: 1,
            },
        ],
    };
    const options = {
        plugins: {
            legend: {
                position: 'bottom', // Positioning the legend at the bottom
                labels: {
                    color: 'white', // Legend text color
                },
            },
        },
    };
    return (
        <div className='chart'>
            <h1 className='chartTitle'> {title} </h1> 
            {totalGames && <p className='totalGames'> Total games: {totalGames} </p>}
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default PieChart;