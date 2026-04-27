/**
 * MagicMoon - Main JavaScript
 * ハンバーガーメニュー、スクロールアニメーション、ヘッダー効果
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // ハンバーガーメニュー
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (hamburger && nav) {
        // ハンバーガーボタンクリック
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // ナビゲーションリンククリックでメニューを閉じる
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // メニュー外クリックで閉じる
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // ヘッダースクロール効果
    // ============================================
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // スクロール時にヘッダーにクラス追加
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // スムーススクロール
    // ============================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // スクロールアニメーション（フェードイン）
    // ============================================
    const fadeElements = document.querySelectorAll('.news-item, .business-item, .case-content, .case-detail-content, .gallery-grid a, .case-description');

    // Intersection Observer の設定
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 各要素を監視
    fadeElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.transitionDelay = `${index * 0.1}s`;
        fadeInObserver.observe(element);
    });

    // ============================================
    // お問い合わせフォーム
    // ============================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // フォームデータの取得
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // バリデーション
            if (!data['company-name'] || !data['name'] || !data['email'] || !data['inquiry-type'] || !data['message']) {
                showNotification('すべての項目を入力してください。', 'error');
                return;
            }

            // メールアドレスの形式チェック
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data['email'])) {
                showNotification('正しいメールアドレスを入力してください。', 'error');
                return;
            }

            // 送信成功のシミュレーション
            showNotification('お問い合わせを受け付けました。<br>担当者よりご連絡いたします。', 'success');
            this.reset();
        });
    }

    // ============================================
    // 通知表示
    // ============================================
    function showNotification(message, type) {
        // 既存の通知を削除
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 通知要素を作成
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : '!'}</span>
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // スタイルを追加
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            padding: 1.2rem 1.5rem;
            border-radius: 12px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' : 'linear-gradient(135deg, #8b0000 0%, #a02020 100%)'};
            color: white;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            animation: slideIn 0.4s ease-out;
            border: 1px solid ${type === 'success' ? 'rgba(201, 169, 98, 0.5)' : 'rgba(255, 100, 100, 0.3)'};
        `;

        // アニメーションスタイルを追加
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.8rem;
            }
            .notification-icon {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: ${type === 'success' ? 'linear-gradient(135deg, #c9a962 0%, #e5d4a1 100%)' : 'rgba(255, 255, 255, 0.2)'};
                color: ${type === 'success' ? '#1a1a1a' : 'white'};
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1rem;
            }
            .notification-close {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
                transition: color 0.3s;
            }
            .notification-close:hover {
                color: white;
            }
            .notification p {
                margin: 0;
                font-size: 0.95rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);

        // DOMに追加
        document.body.appendChild(notification);

        // 閉じるボタン
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        });

        // 自動で消える
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ============================================
    // パララックス効果（ヒーローセクション）
    // ============================================
    const hero = document.querySelector('.hero-bg img');

    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // ============================================
    // ページロード時のアニメーション
    // ============================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});
