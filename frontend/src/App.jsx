import { useState, useEffect } from 'react'
import ContactList from './contactList'
import ContactForm from './contactForm'
import './App.css'

function App() {
  const [contacts, setContacts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentContact, setCurrentContact] =useState({});

  useEffect(() => {
    fetchContacts()
  }, []);

  const fetchContacts = async () => {
    const response = await fetch("http://127.0.0.1:5000/contacts");
    const data = await response.json();
    setContacts(data.contacts);
  };

  const closeModal = () => {
    setModalOpen(false)
    setCurrentContact({})
  };

  const createModal = () => {
    if (!modalOpen) setModalOpen(true)
  };

  const editModal = (contact) => {
    if(modalOpen) return
    setCurrentContact(contact)
    setModalOpen(true)
  };

  const onUpdate = () => {
    closeModal()
    fetchContacts()
  }

  return ( 
    <> 
      <ContactList contacts={contacts} update={editModal} updateContact={onUpdate} />
      <button onClick={createModal}>Create New Contact</button>
      { modalOpen && <div className='modal'>
        <div className='modal-content'>
          <span className='close' onClick={closeModal}>&times;</span>
          <ContactForm existingContact={currentContact} updateContact={onUpdate}/> 
        </div>
      </div>
      }
    </>
  );
}

export default App
