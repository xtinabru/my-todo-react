import { initializeTestDb, insertTestUser } from "./helper/test.js";
import { expect } from "chai";
import fetch from "node-fetch";
import { pool } from './helper/db.js';
import jwt from "jsonwebtoken"; // Импортируем библиотеку для работы с JWT
import dotenv from 'dotenv';

dotenv.config(); // Подключаем переменные окружения

const base_url = 'http://localhost:3001/';

// Функция для генерации токена
const getToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Initialize database before running tests
before(() => {
  initializeTestDb();
});

let token; // Объявляем переменную токена на уровне всего файла
let testUser; // Объявляем переменную тестового пользователя

// Регистрация пользователя перед всеми тестами
before(async () => {
  const email = `testuser${Date.now()}@foo.com`;
  const password = 'password123';

  const userResponse = await fetch(`${base_url}user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const userData = await userResponse.json();
  testUser = userData; // Сохраняем данные пользователя

  // Генерируем токен для нового пользователя
  token = getToken(testUser);
});

// Test suite for getting tasks
// Test suite for getting tasks
describe('GET Tasks', () => {
  before(async () => {
    // Создание задачи перед тестом на получение задач
    const response = await fetch(base_url + 'create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Используем токен для авторизации
      },
      body: JSON.stringify({ 'description': 'Initial task for testing' })
    });

    // Вы можете добавить проверку на успешное создание задачи
    expect(response.status).to.equal(200);
  });

  it('should get all tasks', async () => {
    const response = await fetch(base_url, {
      headers: {
        'Authorization': `Bearer ${token}` // Используем токен здесь
      }
    });
    
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an('array').that.is.not.empty; // Проверяем, что массив не пустой
    expect(data[0]).to.include.all.keys('id', 'description'); // Проверяем структуру объекта
  });
});


// Test suite for creating tasks
describe('POST task', () => {
  it('should post a task', async () => {
    const response = await fetch(base_url + 'create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Используем токен здесь
      },
      body: JSON.stringify({ 'description': 'Task from unit test' })
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('id');
  });

  it('should not post a task without description', async () => {
    const response = await fetch(base_url + 'create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Используем токен здесь
      },
      body: JSON.stringify({ 'description': null })
    });

    const data = await response.json();
    expect(response.status).to.equal(400);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('error');
  });
});

// Test suite for deleting tasks
describe('DELETE task', () => {
  it('should delete a task', async () => {
    // Создаем задачу перед её удалением
    const createResponse = await fetch(base_url + 'create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Используем токен здесь
      },
      body: JSON.stringify({ 'description': 'Task to delete' })
    });
    const createData = await createResponse.json();
    
    const response = await fetch(base_url + `delete/${createData.id}`, {
      method: 'delete',
      headers: {
        'Authorization': `Bearer ${token}` // Используем токен здесь
      }
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('id');
  });

  it('should not delete a task with SQL injection', async () => {
    const response = await fetch(base_url + 'delete/invalid_id', {
      method: 'delete',
      headers: {
        'Authorization': `Bearer ${token}` // Используем токен здесь
      }
    });
    
    const data = await response.json();
    expect(response.status).to.equal(500);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('error');
  });
});

// Test for register endpoint
// Тесты на регистрацию
describe('POST register', () => {
  const email = `newuser${Date.now()}@foo.com`; // Уникальный email
  const password = 'register123';

  beforeEach(async () => {
    await initializeTestDb(); // Инициализация базы данных перед каждым тестом
  });

  it('should register with new email and password', async () => {
    const response = await fetch(base_url + 'user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email, // Используем уникальный email
        password 
      })
    });

    const data = await response.json();
    expect(response.status).to.equal(201, data.error); // Проверяем статус ответа
  });
});


// Test for login endpoint
describe('POST login', () => {
  const email = 'testuser123@foo.com'; 
  const password = 'register123'; // Пароль должен быть таким же, как и при регистрации

  before((done) => {
    pool.query('DELETE FROM account WHERE email = $1', [email], (error) => {
      if (error) {
        console.error('Error deleting test user:', error);
        return done(error);
      }
      done(); 
    });
  });

  it('should login with valid credentials', async () => {
    const response = await fetch(base_url + 'user/login', {
      method: 'post',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        'email': email,
        'password': password 
      })
    });
  
    const data = await response.json();
    console.log('Login response:', data);  
    expect(response.status).to.equal(200, data.error);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('id', 'email', 'token');
  });
});
