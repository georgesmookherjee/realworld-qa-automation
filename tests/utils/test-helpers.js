import { expect } from '@playwright/test';

export function expectURL(page, path) {
  const localURL = `http://localhost:8082${path}`;
  const dockerURL = `http://nginx${path}`;
  
  return expect.soft(page).toHaveURL(new RegExp(
    `(${localURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${dockerURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`
  ));
}