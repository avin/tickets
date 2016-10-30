import React from "react";
import ReactDOM from "react-dom";
import {FieldGroup, FormGroup, ControlLabel, FormControl, Button} from "react-bootstrap";
import {Tickets} from "/imports/api/tickets";

export default class CreateTicket extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isCreating: false,
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const title = ReactDOM.findDOMNode(this.refs.title).value.trim();
        const content = ReactDOM.findDOMNode(this.refs.content).value.trim();

        Tickets.insert({
            title,
            content,
            owner: Meteor.userId(),
            username: Meteor.user().username,
            createdAt: new Date()
        });

        ReactDOM.findDOMNode(this.refs.title).value = '';
        ReactDOM.findDOMNode(this.refs.content).value = '';

        this.setState({isCreating: false})

    }

    render() {
        const {isCreating} =this.state;

        if (isCreating) {
            return (
                <div>
                    <form onSubmit={(e) => this.handleSubmit(e)}>

                        <FormGroup controlId="title">
                            <ControlLabel>Title</ControlLabel>
                            <FormControl componentClass="input" placeholder="Title..." ref="title"/>
                        </FormGroup>

                        <FormGroup controlId="content">
                            <ControlLabel>Content</ControlLabel>
                            <FormControl componentClass="textarea" placeholder="Content..." ref="content"/>
                        </FormGroup>


                        <Button type="submit" bsStyle="primary" style={{marginRight: 10}}>
                            Create
                        </Button>

                        <Button type="button" bsStyle="default" onClick={() => this.setState({isCreating: false})}>
                            Cancel
                        </Button>
                    </form>
                </div>
            )
        } else {
            return (
                <div>
                    <Button bsStyle="success" onClick={() => this.setState({isCreating: true})} block>
                        Add ticket!
                    </Button>
                </div>
            )
        }
    }
}