// tests/global-setup.js
async function globalSetup() {
  console.log('⏳ Attente que les services soient prêts...');
  
  // Essayer localhost d'abord, puis Docker
  const frontendUrls = ['http://localhost:8082', 'http://frontend:4100'];
  const apiUrls = ['http://localhost:3004/api/tags', 'http://api:3000/api/tags'];
  
  await waitForFirstAvailable(frontendUrls, 'Frontend');
  await waitForFirstAvailable(apiUrls, 'API Backend');

  // // Attendre que le frontend soit accessible
  // await waitForService('http://frontend:4100', 'Frontend');
  
  // // Attendre que l'API soit accessible  
  // await waitForService('http://api:3000/api/tags', 'API Backend');
  
  console.log('✅ Tous les services sont prêts pour les tests E2E');
}

async function waitForFirstAvailable(urls, serviceName) {
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status < 500) {
        console.log(`✅ ${serviceName} est accessible via ${url}`);
        return;
      }
    } catch (error) {
      // Service pas encore prêt
    }
    
    // console.log(`⏳ Attente ${serviceName}... (${i + 1}/${maxRetries})`);
    // await new Promise(resolve => setTimeout(resolve, 2000)); // 2 secondes
  }
  
  throw new Error(`❌ ${serviceName} n'est pas accessible après ${maxRetries} tentatives`);
}

export default globalSetup;