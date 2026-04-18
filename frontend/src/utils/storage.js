// 数据库名称和版本
const DB_NAME = 'mentalHealthApp';
const DB_VERSION = 1;

// 打开数据库
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject('数据库打开失败');
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // 创建用户表
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        userStore.createIndex('username', 'username', { unique: true });
      }
      
      // 创建测评结果表
      if (!db.objectStoreNames.contains('assessmentResults')) {
        const resultStore = db.createObjectStore('assessmentResults', { keyPath: 'id', autoIncrement: true });
        resultStore.createIndex('userId', 'userId', { unique: false });
      }
    };
  });
}

// 存储用户数据
async function saveUser(user) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('users', 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.add(user);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('用户保存失败');
  });
}

// 获取用户数据
async function getUser(username) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('users', 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('username');
    const request = index.get(username);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('用户获取失败');
  });
}

// 存储测评结果
async function saveAssessmentResult(result) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('assessmentResults', 'readwrite');
    const store = transaction.objectStore('assessmentResults');
    const request = store.add(result);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('结果保存失败');
  });
}

// 获取用户的测评结果
async function getAssessmentResults(userId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('assessmentResults', 'readonly');
    const store = transaction.objectStore('assessmentResults');
    const index = store.index('userId');
    const request = index.getAll(userId);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('结果获取失败');
  });
}

export {
  saveUser,
  getUser,
  saveAssessmentResult,
  getAssessmentResults
};