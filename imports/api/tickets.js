import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const Tickets = new Mongo.Collection('tickets');

if (Meteor.isServer){
    Meteor.publish('tickets', () => {
        return Tickets.find();
    })
}

Meteor.methods({
    'tickets.insert'(title, content){
        check(title, String);
        check(content, String);

        if (! this.userId){
            throw new Meteor.Error('not-authorized');
        }

        Tickets.insert({
            title,
            content,
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username,
            createdAt: new Date()
        });
    },
    'tickets.remove'(ticketId){
        check(ticketId, String);

        Tickets.remove(ticketId);
    },
    'tickets.update'(ticketId, title, content){
        check(ticketId, String);
        check(title, String);
        check(content, String);

        Tickets.update(ticketId, {
            $set: {
                title,
                content,
                updatedAt: new Date()
            }
        })
    }
});