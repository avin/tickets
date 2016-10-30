import React from "react";
import {FormGroup, FormControl, InputGroup, Button} from "react-bootstrap";
import {Session} from "meteor/session";
import {createContainer} from "meteor/react-meteor-data";

class Filter extends React.Component {
    handleChangeFilter(val) {
        Session.set('filter', val);
    }

    render() {
        const {filter} = this.props;

        return (
            <FormGroup>
                <InputGroup>
                    <FormControl type="text" placeholder="Filter title..." ref="filter"
                                 value={filter} onChange={(e) => this.handleChangeFilter(e.target.value)}/>
                    <InputGroup.Button>
                        <Button onClick={() => this.handleChangeFilter('')}>Clear</Button>
                    </InputGroup.Button>
                </InputGroup>
            </FormGroup>
        )
    }
}

export default createContainer(() => {
    const filter = Session.get('filter') || '';
    return {
        filter
    }
}, Filter)