import React from 'react';
import PropTypes from 'prop-types';

// Decorators
import Radium from 'radium';
import dimensions from 'react-dimensions';

// Components
import EventsBar from './EventsBar';

// Helpers and constants
import { zip, daydiff, cummulativeSeperation } from '../helpers';
import Constants from '../Constants';

/**
 * Default method to convert a date to a string label
 * @param {string} date The string representation of a date
 * @param {string} name The name of an event
 * @return {string} The formatted date string
 */
const defaultGetLabel = (date, name, index) => (name + "\n" +(new Date(date)).toUTCString());

/*
 * This is the Horizontal Timeline. This component expects an array of dates
 * just as strings (e.g. 1993-01-01) and layers them horizontally on the the screen
 * also expects a callback which is activated when that particular index is
 * clicked passing that index along
 */
class HorizontalTimeline extends React.Component {

    render() {
        const props = this.props;

        if (!props.containerWidth) {
            //As long as we do not know the width of our container, do not render anything!
            return false;
        }

        // Convert the date strings to actual date objects
        const dates = props.values.map((value) => new Date(value));

        // Calculate the distances for all events
        const distances = cummulativeSeperation(
            dates,
            props.labelWidth,
            props.minEventPadding,
            props.maxEventPadding,
            props.linePadding,
        );

        console.log(props);
        // Convert the distances and dates to events
        const events = distances.map((distance, index) => ({
            distance,
            label: props.getLabel(props.values[index], props.names[index], index),
            date: props.values[index],
        }));

        const visibleWidth = this.props.containerWidth - 80;

        const totalWidth = Math.max(
            events[events.length - 1].distance + this.props.linePadding,
            visibleWidth
        );

        let barPaddingRight = 0;
        let barPaddingLeft = 0;
        if (!this.props.isOpenEnding) {
            barPaddingRight = totalWidth - events[events.length - 1].distance;
        }
        if (!this.props.isOpenBeginning) {
            barPaddingLeft = events[0].distance;
        }

        return (
            <EventsBar
                width={ props.containerWidth }
                height={ props.containerHeight }
                events={ events }
                isTouchEnabled={ props.isTouchEnabled }
                totalWidth={ totalWidth }
                visibleWidth={ visibleWidth }
                index={ props.index }
                styles={ props.styles }
                indexClick={ props.indexClick }
                labelWidth={ props.labelWidth }
                fillingMotion={ props.fillingMotion }
                barPaddingRight={ barPaddingRight }
                barPaddingLeft={ barPaddingLeft }
            />
        );
    };

}

/**
 * The expected properties from the parent
 * @type {Object}
 */
HorizontalTimeline.propTypes = {
    // --- EVENTS ---
    // Selected index
    index: PropTypes.number,
    // Array containing the sorted date strings
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    // Array containing event names
    names: PropTypes.arrayOf(PropTypes.string).isRequired,
    // Function that takes the index of the array as argument
    indexClick: PropTypes.func,
    // Function to calculate the label based on the date string
    getLabel: PropTypes.func,
    // --- POSITIONING ---
    // the minimum padding between events
    minEventPadding: PropTypes.number,
    // The maximum padding between events
    maxEventPadding: PropTypes.number,
    // Padding at the front and back of the line
    linePadding: PropTypes.number,
    // The width of the label
    labelWidth: PropTypes.number,
    // --- STYLING ---
    styles: PropTypes.object,
    fillingMotion: PropTypes.object,
    slidingMotion: PropTypes.object,
    isOpenEnding: PropTypes.bool,
    isOpenBeginning: PropTypes.bool,
    // --- INTERACTION ---
    isTouchEnabled: PropTypes.bool,
    isKeyboardEnabled: PropTypes.bool,
};

/**
 * The values that the properties will take if they are not provided
 * by the user.
 * @type {Object}
 */
HorizontalTimeline.defaultProps = {
    // --- EVENTS ---
    getLabel: defaultGetLabel,
    // --- POSITIONING ---
    minEventPadding: Constants.MIN_EVENT_PADDING,
    maxEventPadding: Constants.MAX_EVENT_PADDING,
    linePadding: Constants.TIMELINE_PADDING,
    labelWidth: Constants.DATE_WIDTH,
    // --- STYLING ---
    styles: {
        outline: '#dfdfdf',
        background: '#f8f8f8',
        foreground: '#323232'
    },
    fillingMotion: {
        stiffness: 150,
        damping: 25
    },
    slidingMotion: {
        stiffness: 150,
        damping: 25
    },
    isOpenEnding: true,
    isOpenBeginning: true,
    // --- INTERACTION ---
    isTouchEnabled: true,
    isKeyboardEnabled: true,
};

export default Radium(dimensions({ elementResize: true })(HorizontalTimeline));
