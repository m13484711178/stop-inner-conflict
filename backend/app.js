const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
// ✅ 关键修复：Render必须用环境变量端口，不能写死3000
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));
app.use('/music', express.static(path.join(__dirname, '../frontend/public/music')));

// 数据库文件路径
const dbPath = path.resolve(__dirname, './database.db');

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
      type TEXT DEFAULT 'basic',
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
      dimension_scores TEXT,
      suggestions TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // 创建改善建议表
  db.run(`
    CREATE TABLE IF NOT EXISTS suggestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dimension_id INTEGER,
      level TEXT,
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

  // 延迟插入默认数据
  setTimeout(insertDefaultData, 1000);
}

// 插入默认数据
function insertDefaultData() {
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

  db.run(
    'INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)',
    ['admin', 'admin123']
  );

  const emergencyContents = [
    { image: '/images/h1.jpg', quote: '慢慢来，所有的事情都会好起来的。' },
    { image: '/images/h2.jpg', quote: '你已经做得很好了，给自己一些休息的时间。' },
    { image: '/images/h3.jpg', quote: '内心的平静是最重要的，不要被外界的喧嚣所打扰。' },
    { image: '/images/h4.jpg', quote: '每一个困难都是成长的机会，相信自己的力量。' },
    { image: '/images/h5.jpg', quote: '给自己一个拥抱，你值得被爱和被关心。' },
    { image: '/images/h6.jpg', quote: '今天的努力，是为了明天更好的自己。' },
    { image: '/images/h7.jpg', quote: '不要让焦虑占据你的内心，相信一切都会好起来。' },
    { image: '/images/h8.jpg', quote: '每一次呼吸都是新的开始，享受当下的宁静。' },
    { image: '/images/h9.jpg', quote: '你的价值不取决于他人的评价，你是独一无二的。' },
    { image: '/images/h10.jpg', quote: '给自己一点时间，慢慢来，不着急。' },
    { image: '/images/h11.jpg', quote: '生活中的困难都是暂时的，相信自己的力量。' },
    { image: '/images/h12.jpg', quote: '每一个小小的进步都值得庆祝，你做得很好。' },
    { image: '/images/h13.jpg', quote: '保持内心的平静，一切都会朝着好的方向发展。' }
  ];

  emergencyContents.forEach(content => {
    db.run(
      'INSERT OR IGNORE INTO emergency_contents (image, quote) VALUES (?, ?)',
      [content.image, content.quote]
    );
  });

  // 创建音乐表
  db.run(`
    CREATE TABLE IF NOT EXISTS music (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 插入默认音乐
  db.run(
    'INSERT OR IGNORE INTO music (name, url) VALUES (?, ?)',
    ['Ludovico Einaudi - Una Mattina', '/music/Ludovico Einaudi - Una Mattina.mp3']
  );
}

// ✅ 关键修复：把服务器启动放到最外层，不依赖数据库
app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
});

// 路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (err) return res.status(500).json({ error: '服务器错误' });
    if (!user) return res.status(401).json({ error: '用户名或密码错误' });
    const token = 'admin_token_' + Date.now();
    res.json({ token, user: { id: user.id, username: user.username } });
  });
});

app.get('/api/dimensions', (req, res) => {
  db.all('SELECT * FROM dimensions', (err, dimensions) => {
    if (err) return res.status(500).json({ error: '服务器错误' });
    res.json(dimensions);
  });
});

app.get('/api/questions', (req, res) => {
  const { type, dimension_id } = req.query;
  let query = 'SELECT * FROM questions';
  const params = [];
  
  if (type || dimension_id) {
    query += ' WHERE';
    if (type) { query += ' type = ?'; params.push(type); }
    if (type && dimension_id) query += ' AND';
    if (dimension_id) { query += ' dimension_id = ?'; params.push(dimension_id); }
  }
  
  db.all(query, params, (err, questions) => {
    if (err) return res.status(500).json({ error: '服务器错误' });
    res.json(questions);
  });
});

app.post('/api/assessment/result', (req, res) => {
  const { total_score, dimension_scores, suggestions } = req.body;
  db.run(
    'INSERT INTO assessment_results (total_score, dimension_scores, suggestions) VALUES (?, ?, ?)',
    [total_score, JSON.stringify(dimension_scores), JSON.stringify(suggestions)],
    function(err) {
      if (err) return res.status(500).json({ error: '服务器错误' });
      res.json({ id: this.lastID, message: '结果保存成功' });
    }
  );
});

app.get('/api/assessment/statistics', (req, res) => {
  db.all('SELECT * FROM assessment_results', (err, results) => {
    if (err) return res.status(500).json({ error: '服务器错误' });
    res.json(results);
  });
});

app.get('/api/emergency/contents', (req, res) => {
  db.all('SELECT * FROM emergency_contents', (err, contents) => {
    if (err) return res.status(500).json({ error: '服务器错误' });
    res.json(contents);
  });
});

app.get('/api/music', (req, res) => {
  db.all('SELECT * FROM music', (err, music) => {
    if (err) return res.status(500).json({ error: '服务器错误' });
    res.json(music);
  });
});

// 管理员接口：更新急救包内容
app.post('/api/admin/emergency/content', (req, res) => {
  const { image, quote } = req.body;
  db.run(
    'INSERT INTO emergency_contents (image, quote) VALUES (?, ?)',
    [image, quote],
    function(err) {
      if (err) return res.status(500).json({ error: '服务器错误' });
      res.json({ id: this.lastID, message: '内容添加成功' });
    }
  );
});

// 管理员接口：更新音乐
app.post('/api/admin/music', (req, res) => {
  const { name, url } = req.body;
  db.run(
    'INSERT INTO music (name, url) VALUES (?, ?)',
    [name, url],
    function(err) {
      if (err) return res.status(500).json({ error: '服务器错误' });
      res.json({ id: this.lastID, message: '音乐添加成功' });
    }
  );
});

// 管理员接口：删除急救包内容
app.delete('/api/admin/emergency/content/:id', (req, res) => {
  const { id } = req.params;
  db.run(
    'DELETE FROM emergency_contents WHERE id = ?',
    [id],
    function(err) {
      if (err) return res.status(500).json({ error: '服务器错误' });
      res.json({ message: '内容删除成功' });
    }
  );
});

// 管理员接口：删除音乐
app.delete('/api/admin/music/:id', (req, res) => {
  const { id } = req.params;
  db.run(
    'DELETE FROM music WHERE id = ?',
    [id],
    function(err) {
      if (err) return res.status(500).json({ error: '服务器错误' });
      res.json({ message: '音乐删除成功' });
    }
  );
});

// 数据统计接口
app.get('/api/statistics', (req, res) => {
  db.all('SELECT * FROM assessment_results', (err, results) => {
    if (err) return res.status(500).json({ error: '服务器错误' });
    
    // 计算统计数据
    const totalAssessments = results.length;
    const averageScore = results.length > 0 ? 
      results.reduce((sum, r) => sum + r.total_score, 0) / results.length : 0;
    
    // 按维度统计
    const dimensionStats = {};
    results.forEach(result => {
      try {
        const scores = JSON.parse(result.dimension_scores);
        Object.entries(scores).forEach(([dimension, score]) => {
          if (!dimensionStats[dimension]) {
            dimensionStats[dimension] = { total: 0, count: 0 };
          }
          dimensionStats[dimension].total += score;
          dimensionStats[dimension].count += 1;
        });
      } catch (e) {
        console.error('解析维度分数失败:', e);
      }
    });
    
    // 计算各维度平均分
    Object.entries(dimensionStats).forEach(([dimension, stats]) => {
      dimensionStats[dimension].average = stats.total / stats.count;
    });
    
    res.json({
      totalAssessments,
      averageScore,
      dimensionStats,
      recentResults: results.slice(-10).reverse() // 最近10条结果
    });
  });
});