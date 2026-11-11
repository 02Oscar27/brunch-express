import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function menu(page: Page) {
  await page.locator('ion-tab-button[tab="tab2"]').click();
  await expect(page.locator('app-tab2')).toBeVisible();
}

async function carrito(page: Page) {
  await page.locator('ion-tab-button[tab="tab3"]').click();
  await expect(page.locator('app-tab3')).toBeVisible();
}

test('Inicio, cantidades, eliminación y reentrada al carrito', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('app-tab1')).toContainText('Bienvenidos a Brunch Express');
  await menu(page);
  await page.locator('app-tab2 ion-card').first().getByText('Agregar al carrito').click();
  await carrito(page);
  const vista = page.locator('app-tab3');
  await expect(vista).toContainText('Pancakes');
  await expect(vista.locator('.resumen')).toContainText('$18.000');
  await vista.getByText('+', { exact: true }).click();
  await expect(vista.locator('.resumen')).toContainText('$36.000');
  await vista.getByText('-', { exact: true }).click();
  await expect(vista.locator('.resumen')).toContainText('$18.000');
  await vista.getByText('Eliminar', { exact: true }).click();
  await expect(vista).toContainText('Tu carrito está vacío');
  await menu(page);
  await page.locator('app-tab2 ion-card').nth(1).getByText('Agregar al carrito').click();
  await carrito(page);
  await expect(vista).toContainText('Waffles');
  await vista.getByText('-', { exact: true }).click();
  await expect(vista).toContainText('Tu carrito está vacío');
});

test('valida, cancela, guarda localmente y limpia carrito y nombre', async ({ page }) => {
  await page.goto('/');
  await menu(page);
  await page.locator('app-tab2 ion-card').first().getByText('Agregar al carrito').click();
  await carrito(page);
  const vista = page.locator('app-tab3');
  const nombre = vista.locator('ion-input input');
  await vista.getByText('Confirmar pedido', { exact: true }).click();
  await expect(page.locator('ion-toast')).toContainText('Ingresa un nombre de al menos 3 caracteres');
  await nombre.fill('  Ana  ');
  await vista.getByText('Confirmar pedido', { exact: true }).click();
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(vista).toContainText('Pancakes');
  expect(await page.evaluate(() => localStorage.getItem('CapacitorStorage.brunch_pedidos'))).toBeNull();
  await vista.getByText('Confirmar pedido', { exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  await expect(vista).toContainText('Tu carrito está vacío');
  const pedido = await page.evaluate(() => JSON.parse(localStorage.getItem('CapacitorStorage.brunch_pedidos') || '[]'));
  expect(pedido).toHaveLength(1);
  expect(pedido[0]).toMatchObject({ cliente: 'Ana', total: 18000 });
  expect(pedido[0].productos[0]).toMatchObject({ cantidad: 1, producto: { nombre: 'Pancakes' } });
  await menu(page);
  await expect(page.locator('app-tab2')).toContainText('Productos en el carrito: 0');
  await page.locator('app-tab2 ion-card').first().getByText('Agregar al carrito').click();
  await carrito(page);
  await expect(nombre).toHaveValue('');
  await nombre.fill('Luis');
  await vista.getByText('Confirmar pedido', { exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  await expect(vista).toContainText('Tu carrito está vacío');
  await page.reload();
  const guardados = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('CapacitorStorage.brunch_pedidos') || '[]'),
  );
  expect(guardados).toHaveLength(2);
});

test('si falla el almacenamiento conserva productos y nombre', async ({ page }) => {
  await page.goto('/');
  await menu(page);
  await page.locator('app-tab2 ion-card').first().getByText('Agregar al carrito').click();
  await carrito(page);
  const vista = page.locator('app-tab3');
  await vista.locator('ion-input input').fill('Ana');
  await page.evaluate(() => localStorage.setItem('CapacitorStorage.brunch_pedidos', '{JSON inválido'));
  await vista.getByText('Confirmar pedido', { exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  await expect(page.locator('ion-toast')).toContainText('No fue posible guardar el pedido');
  await expect(vista).toContainText('Pancakes');
  await expect(vista.locator('ion-input input')).toHaveValue('Ana');
});
