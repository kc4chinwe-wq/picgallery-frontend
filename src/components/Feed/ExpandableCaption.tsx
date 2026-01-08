import React, { useState, useEffect } from 'react';

interface ExpandableCaptionProps {
    text: string;
    maxLength?: number;
}

const ExpandableCaption: React.FC<ExpandableCaptionProps> = ({ 
    text, 
    maxLength = 150 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldShowButton, setShouldShowButton] = useState(false);

    useEffect(() => {
        setShouldShowButton(text.length > maxLength);
    }, [text, maxLength]);

    const displayText = isExpanded ? text : text.slice(0, maxLength);

    // Split text by newlines and join with <br /> tags
    const formattedText = displayText.split('\n').map((line, i, arr) => (
        <React.Fragment key={i}>
            {line}
            {i < arr.length - 1 && <br />}
        </React.Fragment>
    ));

    return (
        <div className="text-gray-800 whitespace-pre-line">
            {formattedText}
            {!isExpanded && shouldShowButton && '... '}
            {shouldShowButton && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-600 hover:text-blue-700 font-medium ml-1 inline-block"
                >
                    {isExpanded ? 'See less' : 'See more'}
                </button>
            )}
        </div>
    );
};

export default ExpandableCaption;