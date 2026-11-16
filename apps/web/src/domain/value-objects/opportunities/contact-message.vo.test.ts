import {it,expect} from 'vitest';
import {validWebUrl,contactMessage} from './contact-message.vo';
import {t} from '../../../../../storybook/fixtures';
it('accepts secure links without credentials and composes optional paragraphs',()=>{
 for(const value of ['', 'bad', 'http://example.com','https://localhost','https://user:secret@example.com'])expect(validWebUrl(value)).toBe(false);
 expect(validWebUrl('https://preview.example.com/path?q=1')).toBe(true);
 const normal=contactMessage(t,'en','Business','','');expect(normal).toContain('Business');expect(normal).not.toContain('examples of my work');
 const preview=contactMessage(t,'pt-BR','Empresa','https://portfolio.example.com','https://preview.example.com');expect(preview).toContain('Pesquisei');expect(preview).toContain('https://portfolio.example.com');expect(preview).toContain('https://preview.example.com');
});
it('offers a redesign for existing websites and limits evidence-based outreach to three findings',()=>{const message=contactMessage(t,'en','Company','','','https://example.com',['One','Two','Three','Four']);expect(message).toContain('existing website');expect(message).toContain('• One');expect(message).not.toContain('Four');expect(contactMessage(t,'pt-BR','Company','','','https://example.com',['Descrição'])).toContain('renovação');expect(contactMessage(t,'en','Company','','https://preview.example.com','https://example.com',['One'])).toContain('initial website preview');});
