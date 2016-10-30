import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random'
import { assert } from 'meteor/practicalmeteor:chai';

import {Tickets} from './tickets';

if (Meteor.isServer) {
    describe('Tickets', () => {
        describe('methods', () => {
            const userId = Random.id();
            let ticketId;

            beforeEach(() => {
                Tickets.remove({});
                ticketId = Tickets.insert({
                    title: 'The title',
                    content: 'The content',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'test-user'
                })
            });

            it('can delete ticket', () => {
                const deleteTicket = Meteor.server.method_handlers['tickets.remove'];

                const invocation = {userId};

                deleteTicket.apply(userId, [ticketId])

                assert.equal(Tickets.find().count(), 0)

            })
        })
    })
}