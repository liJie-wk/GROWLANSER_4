// 主 JavaScript 文件（如 app.js）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js') // 路径根据实际位置调整
        .then(registration => {
          console.log('ServiceWorker 注册成功:', registration.scope);
        })
        .catch(error => {
          console.log('注册失败:', error);
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function() {
    // 1. 获取所有需要懒加载的图片
    const lazyImages = document.querySelectorAll('img.lazy');
  
    // 2. 配置 Intersection Observer
    const observerOptions = {
      root: null, // 使用视口作为根
      rootMargin: '200px', // 提前200px触发加载
      threshold: 0.1 // 当图片10%进入视口时加载
    };
  
    // 3. 定义回调函数
    const lazyLoad = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // 替换 src 和 srcset
          img.src = img.dataset.src;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.classList.remove('lazy'); // 可选：移除标记类
          observer.unobserve(img); // 停止观察已加载的图片
        }
      });
    };
  
    // 4. 创建观察器并绑定
    const observer = new IntersectionObserver(lazyLoad, observerOptions);
    lazyImages.forEach(img => observer.observe(img));
  
  });