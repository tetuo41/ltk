import { test, expect } from '@playwright/test';

test.describe('Ban/Pick Layout Tests', () => {
  test('ban-pick-container should not overflow from parent', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Find all ban-pick containers
    const banPickContainers = await page.locator('.ban-pick-container').all();
    
    if (banPickContainers.length === 0) {
      console.log('No ban-pick containers found on the page');
      return;
    }
    
    console.log(`Found ${banPickContainers.length} ban-pick containers`);
    
    for (let i = 0; i < banPickContainers.length; i++) {
      const container = banPickContainers[i];
      
      // Get the parent element (surface section)  
      const parentElement = await container.locator('..').first();
      
      // Get bounding boxes
      const containerBox = await container.boundingBox();
      const parentBox = await parentElement.boundingBox();
      
      if (!containerBox || !parentBox) {
        console.log(`Could not get bounding boxes for container ${i}`);
        continue;
      }
      
      console.log(`Container ${i}:`, {
        container: containerBox,
        parent: parentBox,
        overflowRight: containerBox.x + containerBox.width > parentBox.x + parentBox.width,
        overflowBottom: containerBox.y + containerBox.height > parentBox.y + parentBox.height
      });
      
      // Check if container overflows horizontally
      expect(containerBox.x + containerBox.width).toBeLessThanOrEqual(parentBox.x + parentBox.width + 1); // +1 for rounding
      
      // Check if container overflows vertically  
      expect(containerBox.y + containerBox.height).toBeLessThanOrEqual(parentBox.y + parentBox.height + 1); // +1 for rounding
    }
  });
  
  test('take screenshot of ban-pick display', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot first
    await page.screenshot({ path: 'test-results/full-page.png', fullPage: true });
    
    // Find and screenshot each ban-pick container
    const banPickContainers = await page.locator('.ban-pick-container').all();
    
    for (let i = 0; i < banPickContainers.length; i++) {
      const container = banPickContainers[i];
      
      // Scroll to the container
      await container.scrollIntoViewIfNeeded();
      
      // Take screenshot of the container and its parent
      const parentElement = await container.locator('..').first();
      await parentElement.screenshot({ 
        path: `test-results/ban-pick-container-${i}.png`
      });
    }
  });
  
  test('check responsive behavior', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Take screenshot for each viewport
      await page.screenshot({ 
        path: `test-results/ban-pick-${viewport.name}.png`, 
        fullPage: true 
      });
      
      // Check for horizontal overflow on smaller screens
      const banPickContainers = await page.locator('.ban-pick-container').all();
      
      for (let i = 0; i < banPickContainers.length; i++) {
        const container = banPickContainers[i];
        const containerBox = await container.boundingBox();
        
        if (containerBox) {
          // Should not overflow viewport width
          expect(containerBox.x + containerBox.width).toBeLessThanOrEqual(viewport.width);
        }
      }
    }
  });
});