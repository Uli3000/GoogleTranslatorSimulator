import { test, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'
import userEvent from '@testing-library/user-event'

test('My App works as expected', async () => {
    const user = userEvent.setup()
    const app = render(<App />)

    const textareaFrom = app.getByPlaceholderText('Escribir texto')

    user.type(textareaFrom, 'Hola mundo')
    const result = await app.findByDisplayValue(/Hello world/i, {}, { timeout: 15000 })

    expect(result).toBeTruthy()
})