const Person = ({ person, onDelete }) => (
  <li>
    {person.name} {person.number}{' '}
    <button onClick={() => onDelete(person)}>delete</button>
  </li>
)

const Persons = ({ persons, onDelete }) => (
  <ul className="persons">
    {persons.map(person => (
      <Person key={person.id} person={person} onDelete={onDelete} />
    ))}
  </ul>
)

export default Persons
