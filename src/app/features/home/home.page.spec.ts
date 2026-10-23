import { describe, expect, it } from 'vitest';
import { HomePage } from './home.page';
describe('HomePage',()=>{it('initializes signal counter',()=>{const page=new HomePage();expect(page.count()).toBe(0);page.count.update(n=>n+1);expect(page.count()).toBe(1);});});
