CREATE TABLE location_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  start_latitude DECIMAL(10, 8),   -- 開始位置の緯度
  start_longitude DECIMAL(11, 8),  -- 開始位置の経度
  end_latitude DECIMAL(10, 8),     -- 終了位置の緯度
  end_longitude DECIMAL(11, 8),    -- 終了位置の経度
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP, -- 開始時刻
  end_time DATETIME,               -- 終了時刻
  duration INT AS (TIMESTAMPDIFF(SECOND, start_time, end_time)),  -- 自動計算で経過時間を算出
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- レコード作成日時
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- レコード更新日時
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  title VARCHAR(255),
  content TEXT,
  status ENUM('未読', '既読', '対応済み') DEFAULT '未読',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE bulletin_board_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT,
  title VARCHAR(255),
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE groups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  group_name VARCHAR(255)
);

ALTER TABLE users ADD COLUMN group_id INT, ADD FOREIGN KEY (group_id) REFERENCES groups(id);
