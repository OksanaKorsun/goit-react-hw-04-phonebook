import { Component } from 'react';
import { nanoid } from 'nanoid';
import initialContacts from '../contacts.json';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import { GlobalStyle } from './GlobalStyle';
import { Container } from './App.styled';
const localStorageKey = 'updateContacts';
export class App extends Component {
  state = {
    contacts: initialContacts,
    filter: '',
  };
  componentDidMount() {
    const savedContacts = window.localStorage.getItem(localStorageKey);
    if (savedContacts !== null) {
      this.setState({
        contacts: JSON.parse(savedContacts),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      window.localStorage.setItem(
        localStorageKey,
        JSON.stringify(this.state.contacts)
      );
    }
  }

  handleFilter = evt => {
    this.setState({
      filter: evt.target.value,
    });
  };
  deleteContact = contactId => {
    this.setState(prevState => {
      return {
        contacts: prevState.contacts.filter(item => item.id !== contactId),
      };
    });
  };
  addContact = newContact => {
    const contact = {
      id: nanoid(),
      ...newContact,
    };
    const checkContact = this.state.contacts.find(
      contact => contact.name.toLowerCase() === newContact.name.toLowerCase()
    );

    if (checkContact) {
      alert(`${newContact.name} is already in contacts.`);
      return;
    }
    this.setState(prevState => {
      return { contacts: [...prevState.contacts, contact] };
    });
  };

  filteredList = () => {
    const { contacts, filter } = this.state;
    return contacts.filter(contact => {
      return contact.name.toLowerCase().includes(filter.toLowerCase());
    });
  };

  render() {
    const { filter } = this.state;
    return (
      <Container>
        <h1>Phonebook</h1>
        <ContactForm updateContact={this.addContact} />
        <h2>Contacts</h2>
        <Filter filter={filter} onUpdateFilter={this.handleFilter} />
        {this.filteredList().length > 0 && (
          <ContactList
            items={this.filteredList()}
            onDelete={this.deleteContact}
          />
        )}
        <GlobalStyle />
      </Container>
    );
  }
}
