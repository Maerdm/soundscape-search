import { useSelector } from 'react-redux';
import React from 'react'

import './InformationComponent.css';

function InformationComponent() {

    var currentSoundscape = useSelector((state) => state.currentSoundcape);

    return (
        <div className="soundScapeInfo">
            <div className="infos">
                {/* <div className="source-text-container">
                    <span className="source-text">Source: </span>
                    {currentSoundscape.FGsource}
                </div> */}
                <div className="activity-text-container">
                    <span className="activity-text">Activity: </span>
                    {currentSoundscape.Activity}
                </div>
                <div className="location-text-container">
                    <span className="location-text">Location: </span>
                    {currentSoundscape.Location8}
                </div>
            </div>
        </div>
    );
}

export {InformationComponent};

