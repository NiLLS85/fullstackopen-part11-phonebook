import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

// Mensaje de error que envía el backend (por ejemplo, el de validación de Mongoose).
const errorMessage = (error, fallback) => error.response?.data?.error ?? fallback

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const notify = (text, type = 'success') => {
    setNotification({ text, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const resetForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const updateNumber = existing => {
    const ok = window.confirm(
      `${existing.name} is already added to phonebook, replace the old number with a new one?`
    )
    if (!ok) {
      return
    }

    personService
      .update(existing.id, { ...existing, number: newNumber })
      .then(returnedPerson => {
        setPersons(persons.map(p => (p.id === existing.id ? returnedPerson : p)))
        notify(`Changed number of ${returnedPerson.name}`)
        resetForm()
      })
      .catch(error => {
        if (error.response?.status === 404) {
          notify(`Information of ${existing.name} has already been removed from server`, 'error')
          setPersons(persons.filter(p => p.id !== existing.id))
        } else {
          notify(errorMessage(error, `Could not update ${existing.name}`), 'error')
        }
      })
  }

  const addPerson = event => {
    event.preventDefault()
    const name = newName.trim()
    if (name === '') {
      return
    }

    const existing = persons.find(p => p.name.toLowerCase() === name.toLowerCase())
    if (existing) {
      updateNumber(existing)
      return
    }

    personService
      .create({ name, number: newNumber })
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        notify(`Added ${returnedPerson.name}`)
        resetForm()
      })
      .catch(error => notify(errorMessage(error, `Could not add ${name}`), 'error'))
  }

  const deletePerson = person => {
    if (!window.confirm(`Delete ${person.name}?`)) {
      return
    }

    personService
      .remove(person.id)
      .then(() => {
        notify(`Deleted ${person.name}`)
      })
      .catch(() => {
        notify(`Information of ${person.name} has already been removed from server`, 'error')
      })
      .finally(() => {
        setPersons(current => current.filter(p => p.id !== person.id))
      })
  }

  const personsToShow = filter
    ? persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filter} onChange={event => setFilter(event.target.value)} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        name={newName}
        onNameChange={event => setNewName(event.target.value)}
        number={newNumber}
        onNumberChange={event => setNewNumber(event.target.value)}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App
