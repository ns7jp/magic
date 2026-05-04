/**
 * ============================================================
 * MagicMoon - メインJavaScriptファイル
 * ============================================================
 * JavaScriptはWebページに「動き」を加えるためのプログラミング言語です。
 * このファイルでは以下の機能を実装しています：
 *
 *   1. ハンバーガーメニュー（スマホ用メニューの開閉）
 *   2. ヘッダーのスクロール効果（下にスクロールすると見た目が変わる）
 *   3. スムーススクロール（ページ内リンクで滑らかに移動）
 *   4. フェードインアニメーション（スクロールで要素がふわっと出現）
 *   5. お問い合わせフォームの送信処理＆バリデーション
 *   6. 通知ポップアップの表示
 *   7. パララックス効果（背景画像が遅れてスクロールする演出）
 *
 * 【初学者向けの読み方】
 *   1. DOMContentLoaded で「HTML読み込み後に実行する」流れを見る
 *   2. ハンバーガーメニューでは、クリックで active クラスを付け外しする点を見る
 *   3. スクロール処理では、JavaScript がタイミングを決め、CSS が見た目を変える点を見る
 *   4. フォーム処理では、入力値取得 → チェック → 通知表示の順に追う
 * ============================================================
 */


/*
 * DOMContentLoaded イベント
 * ------------------------------------------------------------
 * 「HTMLの読み込みが完了したらこの関数を実行する」という意味。
 * これがないと、JSがHTML要素を探す時にまだ読み込まれていなくてエラーになる。
 *
 * document.addEventListener('イベント名', 関数) の書き方は
 * JavaScriptで「○○が起きたら××する」を表現する基本パターン。
 */
document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    //  1. ハンバーガーメニュー
    // ============================================================
    /*
     * document.getElementById('id名')
     *   → HTML内の id="〇〇" を持つ要素を1つ取得する
     *
     * document.querySelectorAll('CSSセレクタ')
     *   → CSSセレクタに一致する要素をすべて取得する（NodeList形式）
     */
    const hamburger = document.getElementById('hamburger');   // 3本線ボタン
    const nav = document.getElementById('nav');               // ナビゲーションメニュー
    const navLinks = document.querySelectorAll('.nav-list a'); // 各メニューリンク

    // ハンバーガーボタンとナビが両方存在する場合だけ処理
    // （存在しない場合に処理するとエラーになるので、安全のためチェック）
    if (hamburger && nav) {

        // --- ハンバーガーボタンをクリックした時の動作 ---
        hamburger.addEventListener('click', function() {
            /*
             * classList.toggle('class名')
             *   → そのクラスが付いてなければ追加、付いていれば削除する。
             * ここではボタンとナビの両方に 'active' を付け外しすることで
             * CSS側のメニュー開閉アニメーションをトリガーする。
             */
            this.classList.toggle('active');
            nav.classList.toggle('active');

            /*
             * 三項演算子：条件 ? 真の値 : 偽の値
             * メニューが開いている時は body のスクロールを止める（'hidden'）、
             * 閉じている時は通常に戻す（''）。
             */
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // --- ナビリンクをクリックしたらメニューを閉じる ---
        // forEach：配列のような要素を1つずつ処理する繰り返し
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // --- メニューの外側をクリックしたら閉じる ---
        document.addEventListener('click', function(e) {
            /*
             * e.target ... クリックされた要素
             * nav.contains(e.target) ... クリック箇所がナビの中かどうか判定
             *
             * 条件：「ナビの外」かつ「ハンバーガーの外」かつ「メニューが開いている」
             */
            if (!nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }


    // ============================================================
    //  2. ヘッダースクロール効果
    // ============================================================
    /*
     * document.querySelector('.クラス名')
     *   → 一致する最初の1つを取得（複数ある場合は1つ目だけ）
     */
    const header = document.querySelector('.header');
    let lastScroll = 0;  // 直前のスクロール位置を覚えておく変数

    /*
     * window に対して 'scroll' イベントを設定。
     * スクロールするたびに中の関数が呼ばれる。
     */
    window.addEventListener('scroll', function() {
        // 現在のスクロール位置（一番上から何px進んだか）
        const currentScroll = window.pageYOffset;

        // 100px以上スクロールしたらヘッダーに 'scrolled' クラスを付ける
        // CSS側でこのクラスに対する見た目の変化（影・背景）が定義されている
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });


    // ============================================================
    //  3. スムーススクロール（ページ内リンクを滑らかに）
    // ============================================================
    /*
     * a[href^="#"] というCSSセレクタは
     * 「href属性が # で始まる<a>タグ」を意味する。
     * つまり <a href="#contact"> のようなページ内リンクを全部取る。
     */
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // クリックされたリンクの href 属性を取得
            const href = this.getAttribute('href');

            // href が "#" だけの場合はスキップ（ジャンプ先がないため）
            if (href === '#') return;

            // ジャンプ先の要素を取得
            const target = document.querySelector(href);

            // ジャンプ先が存在する場合だけ処理
            if (target) {
                // e.preventDefault()：ブラウザのデフォルト動作（瞬時ジャンプ）をキャンセル
                e.preventDefault();

                // 固定ヘッダーの高さぶん、上にずらして表示する
                const headerHeight = header.offsetHeight;
                // getBoundingClientRect().top ... 画面上部からの距離
                // window.pageYOffset を足して絶対位置に変換
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                // window.scrollTo()でスクロール
                // behavior: 'smooth' で滑らかに移動する
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ============================================================
    //  4. スクロールアニメーション（フェードイン）
    // ============================================================
    /*
     * IntersectionObserver
     *   → 「要素が画面に入った／出た」を検知できる便利なAPI。
     *      スクロール監視より軽くて高速。
     *
     * 流れ：
     *   1. 対象要素をリストアップ
     *   2. それぞれに 'fade-in' クラス（初期状態：透明）を付ける
     *   3. Observer が画面内に入ったのを検知したら 'visible' を追加
     *   4. CSSのトランジションでふわっと表示される
     */
    const fadeElements = document.querySelectorAll(
        '.news-item, .business-item, .case-content, .case-detail-content, .gallery-grid a, .case-description'
    );

    // Observer の設定オプション
    const observerOptions = {
        root: null,                      // null = ビューポート（画面）が基準
        rootMargin: '0px 0px -50px 0px', // 画面下端50px手前で発火（早めに表示開始）
        threshold: 0.1                   // 要素の10%が見えたら発火
    };

    // Observer インスタンスを作成
    const fadeInObserver = new IntersectionObserver(function(entries, observer) {
        // entries：監視している要素の状態一覧
        entries.forEach(entry => {
            // isIntersecting：要素が画面と交差している（=見えている）か
            if (entry.isIntersecting) {
                // 見えたら 'fade-in' と 'visible' を追加
                entry.target.classList.add('fade-in', 'visible');
                // 一度表示したら監視を止める（無駄な処理を減らす）
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 各対象要素に初期クラスを付け、監視を開始
    fadeElements.forEach((element, index) => {
        element.classList.add('fade-in');
        // index を使って表示タイミングを少しずつズラす（連続的なフェードイン）
        // テンプレートリテラル `${変数}` で文字列に値を埋め込める
        element.style.transitionDelay = `${index * 0.1}s`;
        fadeInObserver.observe(element);
    });


    // ============================================================
    //  5. お問い合わせフォームの送信処理
    // ============================================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // ブラウザのデフォルト送信動作をキャンセル
            // （JSで処理を完結させるため）
            e.preventDefault();

            // --- フォームデータの取得 ---
            /*
             * FormData：<form>の入力値を一括取得するオブジェクト。
             * これを使うと name属性を持つ要素を全部まとめて取れる。
             */
            const formData = new FormData(this);
            const data = {};
            // formData を { name: value } 形式の通常オブジェクトに変換
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // --- バリデーション（入力チェック）---
            // どれか1つでも空ならエラー通知を出して終了
            if (!data['company-name'] || !data['name'] || !data['email'] || !data['inquiry-type'] || !data['message']) {
                showNotification('すべての項目を入力してください。', 'error');
                return;  // ここで関数を抜ける（return）
            }

            // メールアドレスの形式チェック（正規表現）
            /*
             * /^[^\s@]+@[^\s@]+\.[^\s@]+$/ の意味：
             *   - ^         先頭から
             *   - [^\s@]+   空白@以外の文字が1文字以上
             *   - @         @がある
             *   - [^\s@]+   また空白@以外の文字が1文字以上
             *   - \.        ドット（.）
             *   - [^\s@]+   さらに文字
             *   - $         末尾まで
             *  → 「a@b.c」のような最低限のメールアドレス形式かチェック
             */
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data['email'])) {
                showNotification('正しいメールアドレスを入力してください。', 'error');
                return;
            }

            // --- 送信成功のシミュレーション ---
            // ※ 本来はここでサーバーにデータを送る処理（fetch等）を書く
            showNotification('お問い合わせを受け付けました。<br>担当者よりご連絡いたします。', 'success');
            // フォームをリセット（入力内容をクリア）
            this.reset();
        });
    }


    // ============================================================
    //  6. 通知（ポップアップ）を表示する関数
    // ============================================================
    /*
     * 関数を切り出しておくと、フォームの送信成功・エラーで
     * 同じコードを2回書かずに使い回せる。
     *
     * @param {string} message 表示するメッセージ
     * @param {string} type    'success' または 'error'
     */
    function showNotification(message, type) {
        // すでに通知が出ていたら削除（重ねて表示しないため）
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // --- 通知要素を新しく作成 ---
        // document.createElement('タグ名') で新しいHTML要素を作る
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        // innerHTML で中身のHTMLを設定
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : '!'}</span>
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // --- スタイルをインラインで指定（CSSの代わり） ---
        // type によって背景色を変える（成功は黒系、エラーは赤系）
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

        // --- アニメーション用のCSSを動的に追加 ---
        // <style>タグを作って <head> に追加することで CSS を後付けできる
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);  /* 画面右の外側からスタート */
                    opacity: 0;
                }
                to {
                    transform: translateX(0);     /* 元の位置に */
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);  /* 画面右へ消えていく */
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
        // <head>に追加してアニメーション定義を有効化
        document.head.appendChild(style);

        // 作成した通知を <body> に追加（実際に画面に表示される）
        document.body.appendChild(notification);

        // --- 閉じるボタン（×）の動作 ---
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            // スライドアウトアニメーションを適用
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            // アニメーション後に要素を削除
            // setTimeout(関数, ミリ秒)：指定時間後に関数を実行
            setTimeout(() => notification.remove(), 300);
        });

        // --- 5秒後に自動で消える ---
        setTimeout(() => {
            // まだ画面に存在していれば削除（手動で閉じられている可能性もある）
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }


    // ============================================================
    //  7. パララックス効果（ヒーロー背景画像）
    // ============================================================
    /*
     * パララックス：手前と奥で異なるスピードでスクロールさせて、
     * 立体感・奥行きを演出する手法。
     * ここでは背景画像をスクロール量の0.3倍だけ縦移動させている。
     */
    const hero = document.querySelector('.hero-bg img');

    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;            // スクロール量の30%
            // transform: translateY() で縦方向に移動
            hero.style.transform = `translateY(${rate}px)`;
        });
    }


    // ============================================================
    //  ページロード完了時の処理
    // ============================================================
    /*
     * 'load' イベントは画像など全リソースの読み込みが終わったタイミング。
     * （DOMContentLoaded はHTMLだけの読み込み完了タイミング）
     */
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

}); // ← DOMContentLoaded のコールバック関数の終わり
