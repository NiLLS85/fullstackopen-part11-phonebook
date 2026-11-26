import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Persons from './Persons'

const persons = [
  { id: '1', name: 'Arto Hellas', number: '040-123456' },
  { id: '2', name: 'Ada Lovelace', number: '39-445323523' },
]

test('renders every person with the number', () => {
  render(<Persons persons={persons} onDelete={() => {}} />)

  expect(screen.getByText('Arto Hellas 040-123456', { exact: false })).toBeInTheDocument()
  expect(screen.getByText('Ada Lovelace 39-445323523', { exact: false })).toBeInTheDocument()
})

test('the delete button gives the right person to the handler', async () => {
  const onDelete = vi.fn()
  render(<Persons persons={persons} onDelete={onDelete} />)

  const buttons = screen.getAllByRole('button', { name: 'delete' })
  await userEvent.setup().click(buttons[1])

  expect(onDelete).toHaveBeenCalledTimes(1)
  expect(onDelete.mock.calls[0][0].name).toBe('Ada Lovelace')
})
