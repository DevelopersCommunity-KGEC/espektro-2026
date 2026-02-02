import React from 'react';

import { YearData } from './timeline';

interface TimelineContainerProps {
    data: YearData;
    position: 'left' | 'right';
}

const TimelineContainer: React.FC<TimelineContainerProps> = ({ data, position }) => {
    return (
        <div className={`timeline-container ${position}`}>
            <div className="timeline-icon">
                <img src={data.icon} alt={data.title} />
            </div>
            <div className="timeline-content">
                {data.title && <h3 className="timeline-title">{data.title}</h3>}
                {data.description && <p>{data.description}</p>}
            </div>
            {data.year && <span className="timeline-date">{data.year}</span>}
        </div>
    );
};

export default TimelineContainer;
