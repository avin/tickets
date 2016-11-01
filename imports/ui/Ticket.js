import React from "react";
import ReactDOM from "react-dom";
import {FormGroup, Button, FormControl, ControlLabel} from "react-bootstrap";
import bootbox from "bootbox";
import moment from "moment";
import {createContainer} from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";

class Ticket extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isEditing: false,
            showComments: false
        }
    }

    handleUpdateSubmit(e) {
        const {ticket} = this.props;

        e.preventDefault();


        const title = ReactDOM.findDOMNode(this.refs.title).value.trim();
        const content = ReactDOM.findDOMNode(this.refs.content).value.trim();

        Meteor.call('tickets.update', ticket._id, title, content);

        this.setState({isEditing: false})
    }

    handleDelete() {
        const {ticket} = this.props;

        bootbox.confirm("Are you sure want to delete ticket?", (result) => {
            if (result) {
                Meteor.call('tickets.remove', ticket._id);
            }
        });
    }

    handleCancel() {
        this.setState({isEditing: false})
    }

    handleSubmitComment(e) {
        const {ticket} = this.props;
        e.preventDefault();

        const comment = ReactDOM.findDOMNode(this.refs.comment).value;
        ReactDOM.findDOMNode(this.refs.comment).value = '';

        Meteor.call('tickets.addComment', ticket._id, comment);
    }

    renderComments() {

        const {ticket} = this.props;

        const comments = (ticket.comments || []).map((comment, index) => {
            return (
                <div key={index}><span className="text-muted">{comment.username}</span>: {comment.content}</div>
            )
        });

        return (
            <div>
                <h5>Comments:
                    <button className="btn btn-xs btn-default" onClick={() => this.setState({showComments: false})}>
                        close
                    </button>
                </h5>
                {comments.length ? comments : <span className="text-muted">No comments yet</span>}

                <hr/>
                <div>
                    <form onSubmit={(e) => this.handleSubmitComment(e)}>
                        <div className="input-group">
                            <input type="text" className="form-control" ref="comment" placeholder="Your comment..."/>
                            <span className="input-group-btn">
                                <button type="submit" className="btn btn-primary">Send</button>
                            </span>

                        </div>
                    </form>
                </div>
            </div>
        )
    }

    render() {
        const {ticket, userId} = this.props;
        const {isEditing, showComments} = this.state;
        const timeStr = moment(ticket.createdAt).format('MMMM Do YYYY, h:mm:ss a');


        if (isEditing && userId) {
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
                    <div className="row" style={{marginBottom: 10}}>
                        <div className="col-md-6">
                            <strong>{ticket.title}</strong>&nbsp;
                            {userId
                                ?
                                <Button onClick={() => this.setState({isEditing: true})} bsSize="xs">Edit</Button>
                                :
                                null
                            }
                        </div>
                        <div className="col-md-6 text-right">
                            <span className="text-muted">({ticket.username} | {timeStr})</span>
                        </div>
                    </div>

                    <div>
                        <pre>{ticket.content}</pre>
                    </div>

                    {showComments
                        ?
                        this.renderComments()
                        :
                        <div className="btn btn-sm btn-info"
                             onClick={() => this.setState({showComments: true})}>
                            Comments ({ticket.comments ? ticket.comments.length : 0})
                        </div>
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