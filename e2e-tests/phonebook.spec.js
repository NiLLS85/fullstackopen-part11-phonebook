const { test, expect } = require('@playwright/test')

test.describe('Phonebook', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Phonebook' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Numbers' })).toBeVisible()
  })

  test('a person can be added', async ({ page }) => {
    const inputs = page.getByRole('textbox')
    await inputs.nth(1).fill('Ada Lovelace')
    await inputs.nth(2).fill('040-1234567')
    await page.getByRole('button', { name: 'add' }).click()

    await expect(page.getByText('Added Ada Lovelace')).toBeVisible()
    await expect(page.locator('.persons')).toContainText('Ada Lovelace 040-1234567')
  })

  test('a wrong number shows the validation error', async ({ page }) => {
    const inputs = page.getByRole('textbox')
    await inputs.nth(1).fill('Ada Lovelace')
    await inputs.nth(2).fill('12345')
    await page.getByRole('button', { name: 'add' }).click()

    await expect(page.locator('.notification.error')).toContainText('number')
    await expect(page.locator('.persons')).not.toContainText('Ada Lovelace')
  })
})
