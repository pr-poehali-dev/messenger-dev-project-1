-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(20),
    last_seen TIMESTAMP,
    is_online BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица чатов
CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    is_group BOOLEAN DEFAULT false,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица участников чатов
CREATE TABLE chat_members (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER NOT NULL REFERENCES chats(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chat_id, user_id)
);

-- Таблица сообщений
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER NOT NULL REFERENCES chats(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    text TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'sent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_chat_members_user_id ON chat_members(user_id);
CREATE INDEX idx_chat_members_chat_id ON chat_members(chat_id);

-- Вставка тестовых данных
INSERT INTO users (username, display_name, bio, is_online) VALUES
('ivan_petrov', 'Иван Петров', 'Доступен для общения', true),
('anna_petrova', 'Анна Петрова', 'В сети', true),
('dmitriy_ivanov', 'Дмитрий Иванов', 'Работаю', true),
('maria_sidorova', 'Мария Сидорова', 'Занята', false);

INSERT INTO chats (name, is_group) VALUES
('Анна Петрова', false),
('Дмитрий Иванов', false),
('Мария Сидорова', false),
('Команда разработки', true),
('Семейный чат', true),
('Книжный клуб', true);

INSERT INTO chat_members (chat_id, user_id) VALUES
(1, 1), (1, 2),
(2, 1), (2, 3),
(3, 1), (3, 4),
(4, 1), (4, 2), (4, 3),
(5, 1), (5, 2), (5, 4),
(6, 1), (6, 3), (6, 4);

INSERT INTO messages (chat_id, sender_id, text, status) VALUES
(1, 2, 'Привет! Как дела?', 'read'),
(1, 1, 'Привет! Всё отлично, спасибо! А у тебя как?', 'read'),
(1, 2, 'Тоже всё хорошо. Хотела обсудить встречу завтра', 'read'),
(1, 1, 'Отлично, встретимся завтра!', 'delivered'),
(2, 3, 'Привет! Как дела?', 'read'),
(2, 1, 'Всё хорошо, работаю над проектом', 'read'),
(3, 1, 'Спасибо за помощь вчера!', 'delivered'),
(3, 4, 'Спасибо за помощь!', 'read'),
(4, 3, 'Код готов к ревью', 'read'),
(5, 2, 'Не забудь про ужин', 'read'),
(6, 3, 'Новая книга просто огонь 🔥', 'read');