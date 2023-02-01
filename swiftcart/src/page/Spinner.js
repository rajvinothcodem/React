import React from 'react'
import loader from './images/loading-gif.gif';
const Spinner = (props) => {
    if (props.enable) {
        return (
            <div class="loader"><img src={loader} /></div>
        );
    }
}
export default Spinner;