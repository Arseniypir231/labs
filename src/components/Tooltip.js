import React, { useState } from 'react';
import './Tooltip.css';

const Tooltip = ({ text, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <span 
            className="tooltip-wrapper"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <span className={`tooltip tooltip-${position}`}>
                    {text}
                </span>
            )}
        </span>
    );
};

export default Tooltip;
