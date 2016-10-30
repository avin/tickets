import React from "react";
import ReactDOM from "react-dom";
import {Tickets as TicketsCollection} from "/imports/api/tickets";
import {FormGroup, Button, FormControl, ControlLabel} from "react-bootstrap";
import bootbox from "bootbox";
import moment from "moment";
import {createContainer} from "meteor/react-meteor-data";

class Ticket extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isEditing: false,
        }
    }

    handleUpdateSubmit(e) {
        const {ticket} = this.props;

        e.preventDefault();


        const title = ReactDOM.findDOMNode(this.refs.title).value.trim();
        const content = ReactDOM.findDOMNode(this.refs.content).value.trim();

        TicketsCollection.update(ticket._id, {
            $set: {
                title,
                content,
                updatedAt: new Date()
            }
        });

        this.setState({isEditing: false})
    }

    handleDelete() {
        const {ticket} = this.props;

        bootbox.confirm("Are you sure want to delete ticket?", (result) => {
            if (result) {
                TicketsCollection.remove(ticket._id);
            }
        });
    }

    handleCancel() {
        this.setState({isEditing: false})
    }

    render() {
        const {ticket, userId} = this.props;
        const {isEditing} = this.state;
        const timeStr = moment(ticket.createdAt).format('MMMM Do YYYY, h:mm:ss a');


        if (isEditing) {
            return (
                <div className="well">
                    <form onSubmit={(e) => this.handleUpdateSubmit(e)}>
                        <FormGroup controlId="title">
                            <ControlLabel>Title</ControlLabel>
                            <FormControl componentClass="input" ref="title" defaultValue={ticket.title}/>
                        </FormGroup>

                        <FormGroup controlId="content">
                            <ControlLabel>Content</ControlLabel>
                            <FormControl componentClass="textarea" ref="content" defaultValue={ticket.content}/>
                        </FormGroup>

                        <div style={{paddingBottom: 30}}>
                            <div className="pull-left">
                                <Button type="button" bsStyle="danger"
                                        onClick={() => this.handleDelete()}>DELETE</Button>
                            </div>
                            <div className="pull-right">
                                <Button type="submit" bsStyle="success" style={{marginRight: 10}}>Save</Button>
                                <Button type="button" onClick={() => this.handleCancel()}>Cancel</Button>
                            </div>
                        </div>


                    </form>
                </div>
            )
        } else {
            return (
                <div style={{marginBottom: 20}}>
                    <div>
                        <strong>{ticket.title}</strong>&nbsp;<span className="text-muted">({ticket.username} | {timeStr})</span>
                    </div>
                    <div>
                        <pre>{ticket.content}</pre>
                    </div>

                    {userId
                        ?
                        <Button onClick={() => this.setState({isEditing: true})}>Edit</Button>
                        :
                        null
                    }

                </div>
            )
        }
    }
}

export default createContainer(() => {
    const userId = Meteor.userId();
    return {
        userId
    }
}, Ticket);