import React, { Component } from 'react';
import PopUpStyles from "../styles/PopUp.js";
import { withStyles } from '@material-ui/core/styles';

class PopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    handleSubmit(event) {
        this.props.onPopUpSubmit(this.state.value);
        event.preventDefault();
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.popUp} tabIndex={-1}>
                <form className={classes.popUpForm} onSubmit={this.handleSubmit}>
                    <label className={classes.popUpLabel}>
                        Code:
                    </label>
                    <input className={classes.popUpInput} type="text" value={this.state.value} onChange={this.handleChange} />
                    <button className={classes.submitButton} type="submit">Submit</button>
                </form>
            </div>
        )
    }
}


export default withStyles(PopUpStyles)(PopUp);