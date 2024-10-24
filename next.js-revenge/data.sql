CREATE TABLE location_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 変更
  -- カラム名変更
ALTER TABLE location_logs CHANGE timestamp start_time DATETIME DEFAULT CURRENT_TIMESTAMP; 
  -- カラム追加
ALTER TABLE location_logs ADD end_time DATETIME;
  -- カラム追加
ALTER TABLE location_logs ADD duration INT;
-- 変更後
CREATE TABLE location_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_time DATETIME,
  duration INT,  -- 経過時間（秒単位で保存）
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);



CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
