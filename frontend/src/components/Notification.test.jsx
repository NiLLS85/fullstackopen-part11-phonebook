import { render, screen } from '@testing-library/react'
import Notification from './Notification'

test('renders nothing without a notification', () => {
  const { container } = render(<Notification notification={null} />)
  expect(container).toBeEmptyDOMElement()
})

test('renders an error with the error class', () => {
  render(<Notification notification={{ text: 'Something failed', type: 'error' }} />)

  const element = screen.getByText('Something failed')
  expect(element).toHaveClass('notification', 'error')
})
