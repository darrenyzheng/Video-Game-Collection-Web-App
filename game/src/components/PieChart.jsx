import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js"

ChartJS.register(Tooltip, Legend, ArcElement);

const PieChart = ({ graphCategory, totalGames, title  }) => {
    let randomColors = [];

    const categories = graphCategory.size;
    for (let i = 0; i < categories; i++) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const a = 0.5;
        randomColors.push(`rgba(${r}, ${g}, ${b}, ${a})`);
    };

    const data = {
        labels: Array.from(graphCategory.keys()),
        datasets: [
            {
                data: Array.from(graphCategory.values()),
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
                position: 'bottom', 
                labels: {
                    color: 'white', 
                },
            },
        },
    };
    return (
        <div className='chart'>
            <h1 className='chartTitle'> {title} </h1> 
            {totalGames && <p className='totalGamesNumber'> Total games: {totalGames} </p>}
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default PieChart;