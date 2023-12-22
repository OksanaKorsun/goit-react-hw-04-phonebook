import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import initialContacts from '../contacts.json';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import { GlobalStyle } from './GlobalStyle';
import { Container, Title } from './App.styled';
const localStorageKey = 'updateContacts';
const getInitialContacts = () => {
  const savedContacts = window.localStorage.getItem(localStorageKey);
  if (savedContacts !== null) {
    return JSON.parse(savedContacts);
  }
  return initialContacts;
};
export const App = () => {
  const [contacts, setContacts] = useState(getInitialContacts);
  const [filter, setFilter] = useState('');

  const handleFilter = evt => {
    setFilter(evt.target.value);
  };
  useEffect(() => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(contacts));
  }, [contacts]);
  const deleteContact = contactId => {
    setContacts(prevContacts =>
      prevContacts.filter(item => item.id !== contactId)
    );
  };

  const addContact = newContact => {
    const contact = {
      id: nanoid(),
      ...newContact,
    };
    const checkContact = contacts.find(
      contact => contact.name.toLowerCase() === newContact.name.toLowerCase()
    );

    if (checkContact) {
      alert(`${newContact.name} is already in contacts.`);
      return;
    }
    setContacts(prevContacts => [...prevContacts, contact]);
  };

  const filteredList = () => {
    return contacts.filter(contact => {
      return contact.name.toLowerCase().includes(filter.toLowerCase());
    });
  };
  return (
    <Container>
      <Title>Phonebook</Title>
      <ContactForm updateContact={addContact} />
      <h2>Contacts</h2>
      <Filter filter={filter} onUpdateFilter={handleFilter} />
      {filteredList().length > 0 && (
        <ContactList items={filteredList()} onDelete={deleteContact} />
      )}
      <GlobalStyle />
    </Container>
  );
};
