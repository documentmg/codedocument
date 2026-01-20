// docs/javascripts/nav-scroll.js
// 增强版：支持滚轮滚动 + 按钮滚动

document.addEventListener('DOMContentLoaded', function() {
  console.log('导航滚动脚本加载 - 增强版');
  
  // 等待页面完全加载
  setTimeout(initNavScroll, 500);
  
  function initNavScroll() {
    const nav = document.querySelector('.md-tabs__list');
    if (!nav) {
      console.log('未找到 .md-tabs__list，可能未启用 tabs 功能');
      return;
    }
    
    console.log('导航容器:', {
      可视宽度: nav.clientWidth,
      总宽度: nav.scrollWidth,
      需要滚动: nav.scrollWidth > nav.clientWidth
    });
    
    // 如果导航项太多，添加功能
    if (nav.scrollWidth > nav.clientWidth) {
      console.log('导航需要滚动，初始化增强功能');
      addWheelScroll(nav);
      addScrollButtons(nav);
      addScrollIndicators(nav);
    } else {
      console.log('导航宽度足够，不需要滚动');
    }
  }
  
  // 1. 添加鼠标滚轮滚动支持
  function addWheelScroll(container) {
    console.log('启用滚轮滚动');
    
    // 阻止默认的滚轮行为（避免页面滚动）
    container.addEventListener('wheel', function(e) {
      // 如果鼠标在导航栏上且可以水平滚动
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        // 垂直滚轮转换为水平滚动
        e.preventDefault();
        container.scrollBy({
          left: e.deltaY * 2, // 乘以2增加滚动速度
          behavior: 'smooth'
        });
        updateScrollIndicators(container);
      }
    });
    
    // 添加触摸板水平滚动支持
    container.addEventListener('wheel', function(e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // 水平滚轮，直接使用
        e.preventDefault();
        container.scrollBy({
          left: e.deltaX * 1.5,
          behavior: 'smooth'
        });
        updateScrollIndicators(container);
      }
    }, { passive: false });
    
    // 添加鼠标悬停时的手型光标
    container.style.cursor = 'grab';
    
    // 添加鼠标拖拽支持
    let isDragging = false;
    let startX;
    let scrollLeft;
    
    container.addEventListener('mousedown', function(e) {
      isDragging = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = 'grabbing';
      container.style.userSelect = 'none';
    });
    
    container.addEventListener('mouseleave', function() {
      isDragging = false;
      container.style.cursor = 'grab';
      container.style.userSelect = '';
    });
    
    container.addEventListener('mouseup', function() {
      isDragging = false;
      container.style.cursor = 'grab';
      container.style.userSelect = '';
    });
    
    container.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // 乘以2增加拖拽灵敏度
      container.scrollLeft = scrollLeft - walk;
      updateScrollIndicators(container);
    });
    
    // 触摸设备支持
    let touchStartX = 0;
    let scrollStartX = 0;
    
    container.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].pageX;
      scrollStartX = container.scrollLeft;
    }, { passive: true });
    
    container.addEventListener('touchmove', function(e) {
      if (!touchStartX) return;
      const touchX = e.touches[0].pageX;
      const deltaX = touchX - touchStartX;
      container.scrollLeft = scrollStartX - deltaX;
      updateScrollIndicators(container);
    }, { passive: true });
    
    container.addEventListener('touchend', function() {
      touchStartX = 0;
    });
  }
  
  // 2. 添加滚动按钮
  function addScrollButtons(container) {
    console.log('添加滚动按钮');
    
    // 检查是否已经添加过按钮
    if (container.parentNode.querySelector('.nav-scroll-btn')) {
      console.log('滚动按钮已存在');
      return;
    }
    
    // 左滚动按钮
    const leftBtn = document.createElement('button');
    leftBtn.innerHTML = '‹';
    leftBtn.className = 'nav-scroll-btn left';
    leftBtn.title = '向左滚动';
    leftBtn.setAttribute('aria-label', '向左滚动导航');
    
    // 右滚动按钮
    const rightBtn = document.createElement('button');
    rightBtn.innerHTML = '›';
    rightBtn.className = 'nav-scroll-btn right';
    rightBtn.title = '向右滚动';
    rightBtn.setAttribute('aria-label', '向右滚动导航');
    
    // 按钮样式
    const btnStyle = `
      background: var(--md-primary-fg-color);
      color: white;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      z-index: 100;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.9;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    
    leftBtn.style.cssText = btnStyle + 'left: 10px;';
    rightBtn.style.cssText = btnStyle + 'right: 10px;';
    
    // 添加悬停效果
    const hoverStyle = `
      opacity: 1;
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    leftBtn.addEventListener('mouseenter', () => {
      leftBtn.style.cssText = btnStyle + 'left: 10px;' + hoverStyle;
    });
    leftBtn.addEventListener('mouseleave', () => {
      leftBtn.style.cssText = btnStyle + 'left: 10px;';
    });
    
    rightBtn.addEventListener('mouseenter', () => {
      rightBtn.style.cssText = btnStyle + 'right: 10px;' + hoverStyle;
    });
    rightBtn.addEventListener('mouseleave', () => {
      rightBtn.style.cssText = btnStyle + 'right: 10px;';
    });
    
    // 点击事件
    leftBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollNav(container, -200);
    });
    
    rightBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollNav(container, 200);
    });
    
    // 添加到页面
    const originalNav = container.parentNode;
    originalNav.style.position = 'relative';
    originalNav.style.padding = '0 60px';
    
    originalNav.appendChild(leftBtn);
    originalNav.appendChild(rightBtn);
    
    // 初始隐藏左按钮
    leftBtn.style.opacity = '0.3';
    leftBtn.style.cursor = 'default';
    
    // 更新按钮状态函数
    function updateButtons() {
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      leftBtn.style.opacity = scrollLeft > 10 ? '0.9' : '0.3';
      leftBtn.style.cursor = scrollLeft > 10 ? 'pointer' : 'default';
      
      rightBtn.style.opacity = scrollLeft < maxScroll - 10 ? '0.9' : '0.3';
      rightBtn.style.cursor = scrollLeft < maxScroll - 10 ? 'pointer' : 'default';
    }
    
    // 监听滚动
    container.addEventListener('scroll', updateButtons);
    
    // 初始检查
    updateButtons();
  }
  
  // 3. 添加滚动指示器
  function addScrollIndicators(container) {
    // 添加滚动进度指示器
    const indicator = document.createElement('div');
    indicator.className = 'nav-scroll-indicator';
    indicator.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: var(--md-primary-fg-color);
      border-radius: 3px;
      z-index: 101;
      transition: width 0.3s ease;
    `;
    
    container.parentNode.appendChild(indicator);
    updateScrollIndicators(container);
  }
  
  function updateScrollIndicators(container) {
    const indicator = container.parentNode.querySelector('.nav-scroll-indicator');
    if (!indicator) return;
    
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const scrollPercent = maxScroll > 0 ? (scrollLeft / maxScroll) : 0;
    const containerWidth = container.parentNode.clientWidth;
    
    indicator.style.width = `${containerWidth * 0.3}px`; // 指示器宽度为容器的30%
    indicator.style.left = `${10 + (containerWidth - indicator.clientWidth - 20) * scrollPercent}px`;
  }
  
  // 4. 滚动函数
  function scrollNav(container, distance) {
    container.scrollBy({
      left: distance,
      behavior: 'smooth'
    });
    
    // 滚动后更新所有状态
    setTimeout(() => {
      updateScrollIndicators(container);
      
      // 更新按钮状态
      const leftBtn = container.parentNode.querySelector('.nav-scroll-btn.left');
      const rightBtn = container.parentNode.querySelector('.nav-scroll-btn.right');
      if (leftBtn && rightBtn) {
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        leftBtn.style.opacity = scrollLeft > 10 ? '0.9' : '0.3';
        leftBtn.style.cursor = scrollLeft > 10 ? 'pointer' : 'default';
        
        rightBtn.style.opacity = scrollLeft < maxScroll - 10 ? '0.9' : '0.3';
        rightBtn.style.cursor = scrollLeft < maxScroll - 10 ? 'pointer' : 'default';
      }
    }, 300);
  }
  
  // 5. 窗口大小改变时重新初始化
  window.addEventListener('resize', function() {
    const nav = document.querySelector('.md-tabs__list');
    if (!nav) return;
    
    // 移除旧按钮
    const oldBtns = nav.parentNode.querySelectorAll('.nav-scroll-btn, .nav-scroll-indicator');
    oldBtns.forEach(btn => btn.remove());
    
    // 重置样式
    nav.parentNode.style.padding = '';
    
    // 重新初始化
    setTimeout(() => {
      if (nav.scrollWidth > nav.clientWidth) {
        addWheelScroll(nav);
        addScrollButtons(nav);
        addScrollIndicators(nav);
      }
    }, 100);
  });
});