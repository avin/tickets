import React from "react";
import {createContainer} from "meteor/react-meteor-data";
import Ticket from "./Ticket";
import {Tickets as TicketsCollection} from "/imports/api/tickets";
import {Session} from 'meteor/session';
import {Meteor} from 'meteor/meteor';

class Tickets extends React.Component {
    render() {
        const {tickets} = this.props;

        console.log(tickets);

        const renderedTickets = tickets.map(ticket => {
            return (
                <Ticket ticket={ticket} key={ticket._id}/>
            )
        });

        if (!renderedTickets.length) {
            return (
                <div className="text-muted text-center">No tickets! Try use another filter or create a new one.</div>
            )
        }

        return (
            <div>
                {renderedTickets}
            </div>
        )
    }
}

export default createContainer(() => {
    Meteor.subscribe('tickets');

    const filterRegExp = new RegExp(Session.get('filter'), 'i');

    const tickets = TicketsCollection.find({title: filterRegExp}, {sort: {createdAt: -1}}).fetch();
    return {
        tickets
    }
}, Tickets)