const CACHE_NAME = 'v1'; // 缓存名称（更新时需修改）

self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache); // 删除旧缓存
            }
          })
        );
      }).then(() => self.clients.claim()) // 立即控制所有页面
    );
  });

  // sw.js
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
  
    // 匹配所有图片请求（根据路径或文件类型）
    if (url.pathname.startsWith('/images/') || 
        event.request.destination === 'image') {
      event.respondWith(
        caches.match(event.request).then(cached => {
          // 返回缓存或先缓存再返回网络请求
          return cached || fetch(event.request).then(response => {
            const clone = response.clone();
            caches.open('image-cache').then(cache => cache.put(event.request, clone));
            return response;
          });
        })
      );
    }
  });