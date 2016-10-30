import React from 'react';
import Filter from './Filter'
import CreateTicket from './CreateTicket'
import Tickets from './Tickets'
import AccountsUIWrapper from './AccountsUIWrapper'
import 'bootstrap';


export default class App extends React.Component {
    render() {
        return (
            <div className="container">
                <AccountsUIWrapper />
                <Filter />
                <hr/>
                <CreateTicket />
                <hr/>
                <Tickets />
            </div>
        )
    }
}