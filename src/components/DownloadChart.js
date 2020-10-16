import React from 'react';
import {Line} from 'react-chartjs-2';

const DownloadsChart = (props) => {
    const {labels, values} = props;

    const data = {
        labels: labels,
        datasets:[{
            data: values,
            backgroundColor: 'rgba(50, 200, 200, 0.6)'
        }]
    }
    return (
        <div>
            <Line
                data={data}
                height={200}
                options={{
                    maintainAspectRatio: false,
                    legend: false
                }}
            />
        </div>
    )
}

export default DownloadsChart;