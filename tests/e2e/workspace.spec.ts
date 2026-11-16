import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('protects pages and supports prospecting, selection and localization', async ({ page }) => {
 await page.goto('/'); await expect(page).toHaveURL(/\/login/);
 await page.getByRole('button',{name:'Entrar na demonstração'}).click();
 await expect(page.getByRole('heading',{name:'Oportunidades',exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Ateliê Aurora (exemplo)',exact:true})).toBeVisible();
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.getByRole('button',{name:'Ver detalhes',exact:true}).first().click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('button',{name:'Preparar contato',exact:true}).last().click();
 await expect(page.getByRole('button',{name:'Abrir WhatsApp',exact:true})).toBeDisabled();
 await page.getByLabel('Seu link de portfólio').fill('https://portfolio.example.com');
 await expect(page.getByRole('textbox',{name:'Mensagem inicial (WhatsApp)'})).toContainText('portfolio.example.com');
 await expect(page.getByRole('button',{name:'Abrir WhatsApp',exact:true})).toBeDisabled();
 const record=page.getByRole('button',{name:'Registrar contato',exact:true});
 if(await record.count() && await record.isEnabled()) { await record.click(); await expect(page.getByRole('status')).toHaveText('Contato registrado.'); }
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await page.getByRole('combobox',{name:'Categoria',exact:true}).selectOption('cafe');
 await page.getByRole('button',{name:'Buscar nesta região',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Café Jardim (exemplo)',exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Ateliê Aurora (exemplo)',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Desenhar região',exact:true}).last().click();
 await page.getByLabel('Latitude',{exact:true}).fill('0'); await page.getByLabel('Longitude',{exact:true}).fill('0');
 await expect(page.getByRole('button',{name:'Buscar nesta região',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Aplicar região',exact:true}).click();
 await page.getByRole('button',{name:'Buscar nesta região',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Nenhuma empresa encontrada com estes filtros'})).toBeVisible();
 await page.getByLabel('Idioma',{exact:true}).selectOption('en');
 await expect(page.getByRole('heading',{name:'Opportunities',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Sign out',exact:true}).click(); await expect(page).toHaveURL(/\/login/);
});
test('preserves region on search failure and offers retry',async({page})=>{
 await page.goto('/login'); await page.getByRole('button',{name:'Entrar na demonstração'}).click();
 await expect(page.getByRole('heading',{name:'Oportunidades',exact:true})).toBeVisible();
 await page.route('**/api/opportunities/search',route=>route.fulfill({status:502,contentType:'application/json',body:'{"error":"Provider unavailable"}'}));
 await page.getByRole('button',{name:'Buscar nesta região',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Não foi possível concluir a busca'})).toBeVisible();
 await expect(page.getByText('Seus filtros e sua região foram mantidos.',{exact:true})).toBeVisible();
 await page.unroute('**/api/opportunities/search'); await page.getByRole('button',{name:'Tentar novamente'}).click();
 await expect(page.getByRole('heading',{name:'Café Jardim (exemplo)'})).toBeVisible();
});
test('authenticates documentation and serves generated changelog',async({page})=>{
 await page.goto('http://localhost:3002/changelog'); await expect(page).toHaveURL(/\/login/);
 await page.getByRole('button',{name:'Entrar na demonstração'}).click();
 await expect(page.getByRole('heading',{name:'Changelog',exact:true})).toBeVisible();
 await expect(page.getByText(/Unreleased/)).toBeVisible();
});
