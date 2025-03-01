document.addEventListener('DOMContentLoaded', function() {
    // 音乐控制元素
    const audio = document.getElementById('background-music');
    const toggleBtn = document.getElementById('toggle-music');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    
    // 音乐提示元素
    const musicNotification = document.getElementById('music-notification');
    const startMusicBtn = document.getElementById('start-music-btn');
    const dismissBtn = document.getElementById('dismiss-notification-btn');
    
    // 音乐播放状态变量
    let musicStarted = false;
    let userInteracted = false;
    let mediaLoaded = false;
    let playAttemptInProgress = false; // 新增变量，防止多次播放请求冲突

    // 检测设备类型和屏幕尺寸
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768;
    
    // 创建音乐正在播放指示器
    createMusicPlayingIndicator();
    
    // 创建加载指示器
    createLoadingIndicator();
    
    // 加载背景图片
    preloadBackgroundImages();
    
    // 优化音频加载
    if (audio) {
        // 更改为按需加载音频
        const audioSource = audio.querySelector('source');
        if (audioSource) {
            const originalSrc = audioSource.getAttribute('data-src') || '';
            if (originalSrc) {
                // 直接设置音频源，解决延迟加载问题
                audioSource.src = originalSrc;
                audio.load();
                
                // 添加加载指示到音乐播放器
                const musicPlayer = document.querySelector('.music-player');
                if (musicPlayer) {
                    const loadingIndicator = document.createElement('div');
                    loadingIndicator.className = 'mini-loading-indicator';
                    loadingIndicator.innerHTML = '<span>加载中...</span>';
                    musicPlayer.appendChild(loadingIndicator);
                    
                    audio.addEventListener('canplaythrough', function() {
                        loadingIndicator.style.display = 'none';
                        mediaLoaded = true;
                    });
                }
            }
        }
    }
    
    // 优化视频加载
    const videoElement = document.querySelector('.featured-video');
    if (videoElement) {
        const videoSource = videoElement.querySelector('source');
        if (videoSource) {
            const originalVideoSrc = videoSource.getAttribute('data-src') || '';
            
            // 添加视频加载指示器
            const videoContainer = videoElement.closest('.video-container');
            if (videoContainer) {
                const videoLoadingIndicator = document.createElement('div');
                videoLoadingIndicator.className = 'video-loading-indicator';
                videoLoadingIndicator.innerHTML = '<div class="loading-spinner"></div><span>点击加载视频</span>';
                videoContainer.appendChild(videoLoadingIndicator);
                
                // 点击加载视频
                videoLoadingIndicator.addEventListener('click', function() {
                    if (originalVideoSrc && !videoSource.src) {
                        videoSource.src = originalVideoSrc;
                        videoElement.load();
                        videoLoadingIndicator.innerHTML = '<div class="loading-spinner active"></div><span>视频加载中...</span>';
                        
                        videoElement.addEventListener('canplay', function() {
                            videoLoadingIndicator.style.display = 'none';
                            videoElement.play();
                        });
                        
                        videoElement.addEventListener('error', function() {
                            videoLoadingIndicator.innerHTML = '<span>视频加载失败，请重试</span>';
                        });
                    }
                });
            }
        }
    }
    
    // 预加载背景图片
    function preloadBackgroundImages() {
        const backgroundImages = ['ass/stars.png', 'ass/twinkling.png', 'ass/clouds.png'];
        
        backgroundImages.forEach(imgSrc => {
            const img = new Image();
            img.src = imgSrc;
        });
    }
    
    // 创建网站全局加载指示器
    function createLoadingIndicator() {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'global-loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>星空加载中...</p>
            </div>
        `;
        document.body.appendChild(loadingIndicator);
        
        // 页面加载完成后隐藏
        window.addEventListener('load', function() {
            setTimeout(function() {
                loadingIndicator.style.opacity = '0';
                setTimeout(function() {
                    loadingIndicator.style.display = 'none';
                    
                    // 页面加载完成后再显示音乐提示，避免过早显示
                    setTimeout(() => {
                        if (!musicStarted && mediaLoaded) {
                            showMusicNotification();
                        }
                    }, 2000);
                }, 500);
            }, 500);
        });
    }
    
    // 尝试自动播放音乐（现代浏览器通常会阻止）
    function attemptAutoplay() {
        if (audio && !musicStarted && audio.readyState >= 2 && !playAttemptInProgress) {
            playAttemptInProgress = true; // 防止多次播放请求
            
            audio.volume = 0.7; // 设置初始音量
            let playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicStarted = true;
                    updateMusicUIState(true);
                    showPlayingIndicator();
                    hideMusicNotification();
                    playAttemptInProgress = false;
                }).catch(error => {
                    console.log('自动播放失败:', error);
                    showMusicNotification();
                    playAttemptInProgress = false;
                });
            }
        }
    }
    
    // 设置页面可见性变化处理
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible' && musicStarted && !audio.paused) {
            showPlayingIndicator();
        } else {
            hidePlayingIndicator();
        }
    });
    
    // 滚动监听 - 使用性能更好的Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });
    
    // 选择所有需要监听的元素
    const fadeElements = document.querySelectorAll('.fade-in-scroll');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
    
    // 延迟加载图片
    const lazyImages = document.querySelectorAll('.gallery-item img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src') || img.getAttribute('src');
                
                if (src) {
                    // 添加加载指示器
                    const parent = img.parentElement;
                    const loadingOverlay = document.createElement('div');
                    loadingOverlay.className = 'image-loading-overlay';
                    loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
                    parent.appendChild(loadingOverlay);
                    
                    // 创建新图像进行预加载
                    const newImg = new Image();
                    newImg.onload = function() {
                        img.src = src;
                        loadingOverlay.remove();
                        imageObserver.unobserve(img);
                    };
                    newImg.onerror = function() {
                        loadingOverlay.innerHTML = '<div class="loading-error">加载失败</div>';
                        setTimeout(() => loadingOverlay.remove(), 2000);
                        imageObserver.unobserve(img);
                    };
                    newImg.src = src;
                }
            }
        });
    }, {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    // 音乐通知控制
    function showMusicNotification() {
        if (musicNotification && !musicStarted) {
            musicNotification.classList.add('show');
        }
    }
    
    function hideMusicNotification() {
        if (musicNotification) {
            musicNotification.classList.remove('show');
        }
    }
    
    // 创建音乐正在播放指示器
    function createMusicPlayingIndicator() {
        const indicator = document.createElement('div');
        indicator.classList.add('music-playing-indicator');
        indicator.innerHTML = `
            <i class="fas fa-music"></i>
            <div class="music-wave">
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
            </div>
        `;
        document.body.appendChild(indicator);
    }
    
    // 显示正在播放指示器
    function showPlayingIndicator() {
        const indicator = document.querySelector('.music-playing-indicator');
        if (indicator) {
            indicator.classList.add('show');
            // 3秒后自动隐藏
            setTimeout(() => {
                hidePlayingIndicator();
            }, 5000);
        }
    }
    
    // 隐藏正在播放指示器
    function hidePlayingIndicator() {
        const indicator = document.querySelector('.music-playing-indicator');
        if (indicator) {
            indicator.classList.remove('show');
        }
    }
    
    // 更新音乐UI状态
    function updateMusicUIState(isPlaying) {
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    }
    
    // 开始播放音乐按钮点击事件
    if (startMusicBtn) {
        startMusicBtn.addEventListener('click', function() {
            if (audio && !playAttemptInProgress) {
                playAttemptInProgress = true;
                
                // 检查音频是否已加载
                if (audio.readyState < 2) {
                    const loadingIndicator = document.querySelector('.mini-loading-indicator');
                    if (loadingIndicator) {
                        loadingIndicator.style.display = 'block';
                    }
                    
                    const onCanPlay = function() {
                        startPlayback();
                        audio.removeEventListener('canplaythrough', onCanPlay);
                    };
                    
                    audio.addEventListener('canplaythrough', onCanPlay);
                } else {
                    startPlayback();
                }
                
                function startPlayback() {
                    const playPromise = audio.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            musicStarted = true;
                            updateMusicUIState(true);
                            showPlayingIndicator();
                            hideMusicNotification();
                            playAttemptInProgress = false;
                        }).catch(error => {
                            console.log('无法播放音频:', error);
                            alert('无法自动播放音频，请点击页面上的音乐控制按钮手动播放。');
                            hideMusicNotification();
                            playAttemptInProgress = false;
                        });
                    } else {
                        playAttemptInProgress = false;
                    }
                }
            }
        });
    }
    
    // 关闭通知按钮点击事件
    if (dismissBtn) {
        dismissBtn.addEventListener('click', function() {
            hideMusicNotification();
        });
    }
    
    // 音乐控制按钮事件监听
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            if (playAttemptInProgress) return; // 如果正在处理播放请求，忽略点击
            
            playAttemptInProgress = true;
            
            if (audio.paused) {
                const playPromise = audio.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        musicStarted = true;
                        updateMusicUIState(true);
                        showPlayingIndicator();
                        playAttemptInProgress = false;
                    }).catch(error => {
                        console.log('无法播放音频:', error);
                        playAttemptInProgress = false;
                    });
                } else {
                    playAttemptInProgress = false;
                }
            } else {
                audio.pause();
                updateMusicUIState(false);
                hidePlayingIndicator();
                playAttemptInProgress = false;
            }
        });
    }
    
    // 从音频控件直接播放/暂停时同步按钮状态
    if (audio) {
        audio.addEventListener('play', function() {
            musicStarted = true;
            updateMusicUIState(true);
            showPlayingIndicator();
        });
        
        audio.addEventListener('pause', function() {
            updateMusicUIState(false);
            hidePlayingIndicator();
        });
    }
    
    // 用户第一次交互时尝试播放音乐
    function onFirstUserInteraction() {
        if (!userInteracted) {
            userInteracted = true;
            
            // 稍微延迟尝试自动播放，避免与其他交互冲突
            setTimeout(() => {
                attemptAutoplay();
            }, 300);
            
            // 移除所有事件监听器
            document.removeEventListener('click', onFirstUserInteraction);
            document.removeEventListener('touchstart', onFirstUserInteraction);
            document.removeEventListener('keydown', onFirstUserInteraction);
            document.removeEventListener('scroll', onFirstUserInteraction);
        }
    }
    
    // 添加用户交互监听
    document.addEventListener('click', onFirstUserInteraction);
    document.addEventListener('touchstart', onFirstUserInteraction);
    document.addEventListener('keydown', onFirstUserInteraction);
    document.addEventListener('scroll', onFirstUserInteraction);
    
    // 页面完全加载后尝试自动播放
    window.addEventListener('load', function() {
        // 稍微延迟尝试自动播放
        setTimeout(attemptAutoplay, 1500);
    });
    
    // 处理图片加载错误
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', function() {
            console.log('图片加载失败:', img.src);
            img.classList.add('image-error');
            
            // 尝试使用备用图片
            if (!img.src.includes('fallback')) {
                const fallbackSrc = img.src.replace(/\.[^/.]+$/, '') + '-fallback.jpg';
                const fallbackImg = new Image();
                fallbackImg.onload = function() {
                    img.src = fallbackSrc;
                };
                fallbackImg.src = fallbackSrc;
            }
        });
    });
    
    // 视频播放优化
    const video = document.querySelector('.featured-video');
    if (video) {
        // 移动设备上禁用自动播放并降低质量
        if (isMobile) {
            video.setAttribute('playsinline', '');
            video.setAttribute('preload', 'none');
        }
        
        // 监控视频加载错误
        video.addEventListener('error', function(e) {
            console.log('视频加载错误:', e);
            const videoContainer = video.closest('.video-container');
            if (videoContainer) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'video-error-message';
                errorMessage.textContent = '视频加载失败，请稍后再试';
                videoContainer.appendChild(errorMessage);
            }
        });
    }
    
    // 优化背景动画 - 根据设备性能调整
    if (isMobile || isSmallScreen) {
        // 移动设备上降低背景动画复杂度
        const clouds = document.querySelector('.clouds');
        if (clouds) {
            clouds.style.display = 'none'; // 移除云层以提高性能
        }
    }
    
    // 添加页面加载完成事件
    window.addEventListener('load', function() {
        // 移除页面预加载状态
        document.body.classList.add('loaded');
    });
    
    // 添加响应式调整
    window.addEventListener('resize', function() {
        // 更新小屏幕状态
        const currentIsSmallScreen = window.innerWidth < 768;
        
        // 如果屏幕尺寸类别改变，更新显示
        if (currentIsSmallScreen !== isSmallScreen) {
            // 不使用重载，改为动态调整元素
            const clouds = document.querySelector('.clouds');
            if (clouds) {
                clouds.style.display = currentIsSmallScreen ? 'none' : 'block';
            }
        }
    });
});