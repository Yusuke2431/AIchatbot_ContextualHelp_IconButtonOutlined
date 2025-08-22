// チームサマリ - チャットボット機能のみ
class TeamSummary {
    constructor() {
        this.chatWindow = null;
        this.chatMessages = null;
        this.chatInput = null;
        this.fab = null;
    }

    init() {
        this.initializeChatBot();
        console.log('チームサマリページ初期化完了 - チャットボット機能のみ');
    }

    initializeChatBot() {
        // DOM要素を取得
        this.chatWindow = document.getElementById('contextChatWindow');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.fab = document.getElementById('fab');

        if (!this.chatWindow || !this.chatMessages || !this.chatInput || !this.fab) {
            console.error('チャットボット要素が見つかりません');
            return;
        }

        this.setupChatEventListeners();
        console.log('チャットボット初期化完了');
    }

    setupChatEventListeners() {
        // ヘルプボタンのイベント
        document.querySelectorAll('.help-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const context = e.target.closest('[data-context]')?.dataset.context || 'general';
                this.openContextualChat(context);
            });
        });

        // AIボタンのイベント
        document.querySelectorAll('.ai-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const context = e.target.closest('[data-context]')?.dataset.context || 'general';
                this.openContextualChat(context, true); // AI モード
            });
        });

        // FABのイベント
        this.fab.addEventListener('click', () => {
            this.openGeneralChat();
        });

        // チャット閉じるボタン
        const chatClose = document.getElementById('chatClose');
        if (chatClose) {
            chatClose.addEventListener('click', () => {
                this.closeChat();
            });
        }

        // メッセージ送信
        const sendButton = document.getElementById('sendButton');
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // Enterキーで送信
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // ESCキーでチャットを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.chatWindow.classList.contains('active')) {
                this.closeChat();
            }
        });

        // 質問候補セレクト
        const suggestionsSelect = document.getElementById('suggestionsSelect');
        if (suggestionsSelect) {
            suggestionsSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.chatInput.value = e.target.value;
                    e.target.value = '';
                }
            });
        }
    }

    openContextualChat(context, isAiMode = false) {
        // チャットウィンドウを表示
        this.chatWindow.classList.add('active');
        
        // タイトルとコンテキスト情報を更新
        const chatTitle = document.getElementById('chatTitle');
        const contextInfo = document.getElementById('contextInfo');
        const contextText = contextInfo.querySelector('.context-text');
        
        if (isAiMode) {
            chatTitle.textContent = 'AIインサイト';
            contextText.textContent = this.getContextLabel(context) + ' の分析';
        } else {
            chatTitle.textContent = 'ヘルプ';
            contextText.textContent = this.getContextLabel(context) + ' について';
        }

        // 初期メッセージを設定
        this.resetChatMessages(this.getInitialMessage(context, isAiMode));
        
        // 質問候補を更新
        this.updateSuggestions(context, isAiMode);
        
        // 入力フィールドにフォーカス
        setTimeout(() => {
            this.chatInput.focus();
        }, 300);

        console.log(`${isAiMode ? 'AI' : 'ヘルプ'}チャット開始:`, context);
    }

    openGeneralChat() {
        this.chatWindow.classList.add('active');
        
        const chatTitle = document.getElementById('chatTitle');
        const contextInfo = document.getElementById('contextInfo');
        const contextText = contextInfo.querySelector('.context-text');
        
        chatTitle.textContent = 'サポート';
        contextText.textContent = '一般的なお困りごと';

        this.resetChatMessages('こんにちは！どのような点についてお聞きしたいですか？');
        this.updateSuggestions('general', false);
        
        setTimeout(() => {
            this.chatInput.focus();
        }, 300);

        console.log('一般チャット開始');
    }

    closeChat() {
        this.chatWindow.classList.remove('active');
        this.chatInput.value = '';
        console.log('チャット終了');
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // ユーザーメッセージを追加
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // ボット応答をシミュレート
        setTimeout(() => {
            const response = this.getBotResponse(message);
            this.addMessage(response, 'bot');
        }, 800);
    }

    addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        
        const time = new Date().toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${sender === 'bot' ? '🤖' : '👤'}
            </div>
            <div class="message-content">
                <p>${message}</p>
                <div class="message-time">${time}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    resetChatMessages(initialMessage) {
        this.chatMessages.innerHTML = `
            <div class="bot-message">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>${initialMessage}</p>
                    <div class="message-time">今</div>
                </div>
            </div>
        `;
    }

    getContextLabel(context) {
        const labels = {
            'open-to-merge': 'オープンからマージまでの時間',
            'open-to-review': 'オープンからレビューまでの時間',
            'review-to-merge': 'レビューからマージまでの時間',
            'general': '一般的なご質問'
        };
        return labels[context] || '不明なコンテキスト';
    }

    getInitialMessage(context, isAiMode) {
        if (isAiMode) {
            return `${this.getContextLabel(context)}のAI分析を開始します。どのような観点で分析しましょうか？`;
        } else {
            return `${this.getContextLabel(context)}について、どのような点をお聞きしたいですか？`;
        }
    }

    updateSuggestions(context, isAiMode) {
        const suggestionsSelect = document.getElementById('suggestionsSelect');
        if (!suggestionsSelect) return;

        // 質問候補をクリア
        suggestionsSelect.innerHTML = '<option value="">質問を選択してください</option>';

        let suggestions = [];
        
        if (isAiMode) {
            suggestions = [
                'この数値の傾向を分析してください',
                'パフォーマンス改善の提案をしてください',
                '他チームとの比較はどうですか？',
                'この指標の改善方法を教えてください'
            ];
        } else {
            const contextSuggestions = {
                'open-to-merge': [
                    'この数値は良い状態ですか？',
                    '改善するにはどうすればよいですか？',
                    '他のチームと比べてどうですか？'
                ],
                'open-to-review': [
                    'レビュー待ち時間を短縮するには？',
                    'この指標の目安を教えてください',
                    'アラート設定は可能ですか？'
                ],
                'review-to-merge': [
                    'マージまでの時間が長い原因は？',
                    'この数値の改善方法は？',
                    'ベストプラクティスを教えてください'
                ],
                'general': [
                    'ダッシュボードの使い方を教えてください',
                    'データの更新頻度はどのくらいですか？',
                    'アラート機能はありますか？'
                ]
            };
            suggestions = contextSuggestions[context] || contextSuggestions['general'];
        }

        // 候補を追加
        suggestions.forEach(suggestion => {
            const option = document.createElement('option');
            option.value = suggestion;
            option.textContent = suggestion;
            suggestionsSelect.appendChild(option);
        });
    }

    getBotResponse(userMessage) {
        // シンプルなボット応答ロジック
        const responses = [
            'ご質問ありがとうございます。この指標について詳しく説明いたします。',
            'そちらの件についてですが、一般的には以下のような対応が推奨されます。',
            'データを確認したところ、現在の状況は標準的な範囲内です。',
            'その点については、チーム設定から詳細を確認できます。',
            '追加の分析が必要でしたら、詳細レポート機能をご利用ください。'
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    const teamSummary = new TeamSummary();
    teamSummary.init();
});