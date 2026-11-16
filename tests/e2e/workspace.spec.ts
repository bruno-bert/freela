import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('protects pages and supports prospecting, selection and localization', async ({ page }) => {
 await page.goto('/'); await expect(page).toHaveURL(/\/login/);
 await page.getByRole('button',{name:'Entrar na demonstração'}).click();
 await expect(page.getByRole('heading',{name:'Oportunidades',exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Aurora Studio (example)',exact:true})).toBeVisible();
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.getByRole('button',{name:'Ver detalhes',exact:true}).first().click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('button',{name:'Preparar contato',exact:true}).last().click();
 await expect(page.getByRole('button',{name:'Abrir WhatsApp',exact:true})).toBeDisabled();
 await page.getByLabel('URL do portfólio (opcional)').fill('https://portfolio.example.com');
 await expect(page.getByRole('textbox',{name:'Mensagem inicial (WhatsApp)'})).toContainText('portfolio.example.com');
 await expect(page.getByRole('button',{name:'Abrir WhatsApp',exact:true})).toBeDisabled();
 const record=page.getByRole('button',{name:'Registrar contato',exact:true});
 if(await record.count() && await record.isEnabled()) { await record.click(); await expect(page.getByRole('status')).toHaveText('Contato registrado.'); }
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await page.getByRole('combobox',{name:'Categoria',exact:true}).selectOption('cafe');
 await page.getByRole('button',{name:'Buscar nesta região',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Garden Café (example)',exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Aurora Studio (example)',exact:true})).toHaveCount(0);
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
 await expect(page.getByRole('heading',{name:'Garden Café (example)'})).toBeVisible();
});
test('authenticates documentation and serves generated changelog',async({page})=>{
 await page.goto('http://localhost:3002/changelog'); await expect(page).toHaveURL(/\/login/);
 await page.getByRole('button',{name:'Entrar na demonstração'}).click();
 await expect(page.getByRole('heading',{name:'Changelog',exact:true})).toBeVisible();
 await expect(page.getByText(/Unreleased/)).toBeVisible();
});
test('travels internationally, prepares English previews and persists an unprocessed site request',async({page})=>{
 await page.goto('/login');await page.getByRole('button',{name:'Entrar na demonstração'}).click();
 await page.getByRole('combobox',{name:'Explore mercados internacionais'}).selectOption('dublin');
 await expect(page.getByRole('status')).toHaveText('Região selecionada. Busque nesta área para atualizar os resultados.');
 await expect(page.getByRole('button',{name:'Ver detalhes',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Buscar nesta região',exact:true}).click();
 await page.getByRole('button',{name:'Preparar contato',exact:true}).first().click();
 const text=page.getByRole('textbox',{name:'Mensagem inicial (WhatsApp)'});
 await expect(text).toHaveValue(/Hi!/);await expect(text).not.toHaveValue(/portfolio|\[TBD\]/);
 await page.getByLabel('Já tenho uma prévia do site').check();await page.getByLabel('URL da prévia do site').fill('https://preview.example.com/dublin');await expect(text).toHaveValue(/initial website preview/);
 await page.getByRole('button',{name:'Português',exact:true}).click();await expect(text).toHaveValue(/Pesquisei sobre/);
 await page.getByRole('button',{name:'English',exact:true}).click();await page.getByLabel('URL do portfólio (opcional)').fill('https://portfolio.example.com');await expect(text).toHaveValue(/examples of my work/);await page.getByLabel('URL do portfólio (opcional)').fill('');await expect(text).not.toHaveValue(/examples of my work/);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 const queue=page.getByRole('button',{name:'Colocar pedido de site na fila'});if(await queue.count()){await queue.click();}
 await expect(page.getByText('Pedido salvo · pendente',{exact:true})).toBeVisible();await page.reload();
 await page.getByRole('combobox',{name:'Explore mercados internacionais'}).selectOption('dublin');await page.getByRole('button',{name:'Buscar nesta região',exact:true}).click();await page.getByRole('button',{name:'Preparar contato',exact:true}).first().click();await expect(page.getByText('Pedido salvo · pendente',{exact:true})).toBeVisible();
});
