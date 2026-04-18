const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径
const dbPath = path.resolve(__dirname, '../database.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('数据库连接成功');
    // 初始化数据库表
    initDatabase();
  }
});

// 初始化数据库表
function initDatabase() {
  // 创建用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建维度表
  db.run(`
    CREATE TABLE IF NOT EXISTS dimensions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建题目表
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      dimension_id INTEGER,
      is_reverse INTEGER DEFAULT 0,
      type TEXT DEFAULT 'basic', -- basic 或 detailed
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (dimension_id) REFERENCES dimensions(id)
    )
  `);

  // 创建测评结果表
  db.run(`
    CREATE TABLE IF NOT EXISTS assessment_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_score INTEGER,
      dimension_scores TEXT, -- JSON格式存储各维度得分
      suggestions TEXT, -- JSON格式存储建议
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // 创建改善建议表
  db.run(`
    CREATE TABLE IF NOT EXISTS suggestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dimension_id INTEGER,
      level TEXT, -- light, medium, heavy
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (dimension_id) REFERENCES dimensions(id)
    )
  `);

  // 创建心理急救包内容表
  db.run(`
    CREATE TABLE IF NOT EXISTS emergency_contents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image TEXT,
      quote TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 插入默认数据
  insertDefaultData();
}

// 插入默认数据
function insertDefaultData() {
  // 插入默认维度
  const dimensions = [
    { name: '未来不确定性', description: '对未来发展的担忧和不确定性' },
    { name: '学业内卷', description: '学业竞争带来的压力和内耗' },
    { name: '人际关系', description: '人际关系中的焦虑和冲突' },
    { name: '自我认知', description: '对自我的认知和评价' },
    { name: '价值冲突', description: '价值观的冲突和困惑' }
  ];

  dimensions.forEach(dimension => {
    db.run(
      'INSERT OR IGNORE INTO dimensions (name, description) VALUES (?, ?)',
      [dimension.name, dimension.description]
    );
  });

  // 插入默认管理员用户
  db.run(
    'INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)',
    ['admin', 'admin123']
  );

  // 插入默认心理急救包内容
  const emergencyContents = [
    {
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=peaceful%20nature%20landscape%20with%20mountains%20and%20lake%20sunset%20calming%20scene&image_size=landscape_16_9',
      quote: '慢慢来，所有的事情都会好起来的。'
    },
    {
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=serene%20forest%20path%20with%20sunlight%20filtering%20through%20trees%20peaceful%20scene&image_size=landscape_16_9',
      quote: '你已经做得很好了，给自己一些休息的时间。'
    },
    {
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20beach%20with%20clear%20blue%20water%20and%20white%20sand%20calm%20ocean&image_size=landscape_16_9',
      quote: '内心的平静是最重要的，不要被外界的喧嚣所打扰。'
    }
  ];

  emergencyContents.forEach(content => {
    db.run(
      'INSERT OR IGNORE INTO emergency_contents (image, quote) VALUES (?, ?)',
      [content.image, content.quote]
    );
  });
}

module.exports = db;