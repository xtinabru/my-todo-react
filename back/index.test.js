import { initializeTestDb, insertTestUser } from "./helper/test.js";
import { expect } from "chai";
import fetch from "node-fetch";
import { pool } from './helper/db.js';
import jwt from "jsonwebtoken"; 
import dotenv from 'dotenv';

dotenv.config(); 
const base_url = 'http://localhost:3001/';


const getToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


before(() => {
  initializeTestDb();
});

let token; 
let testUser; 


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
  testUser = userData; 


  token = getToken(testUser);
});


describe('GET Tasks', () => {
  before(async () => {
   
    const response = await fetch(base_url + 'create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ 'description': 'Initial task for testing' })
    });

   
    expect(response.status).to.equal(200);
  });

  it('should get all tasks', async () => {
    const response = await fetch(base_url, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an('array').that.is.not.empty; 
    expect(data[0]).to.include.all.keys('id', 'description'); 
  });
});


// Test suite for creating tasks
describe('POST task', () => {
  it('should post a task', async () => {
    const response = await fetch(base_url + 'create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
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
        'Authorization': `Bearer ${token}` 
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
   
    const createResponse = await fetch(base_url + 'create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ 'description': 'Task to delete' })
    });
    const createData = await createResponse.json();
    
    const response = await fetch(base_url + `delete/${createData.id}`, {
      method: 'delete',
      headers: {
        'Authorization': `Bearer ${token}` 
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
        'Authorization': `Bearer ${token}` 
      }
    });
    
    const data = await response.json();
    expect(response.status).to.equal(500);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('error');
  });
});

// Test for register endpoint
describe('POST register', () => {
  const email = `newuser${Date.now()}@foo.com`; 
  const password = 'register123';

  beforeEach(async () => {
    await initializeTestDb(); 
  });

  it('should register with new email and password', async () => {
    const response = await fetch(base_url + 'user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email, 
        password 
      })
    });

    const data = await response.json();
    expect(response.status).to.equal(201, data.error); 
  });
});

// Test for login endpoint
describe('POST login', () => {
  const email = 'testuser123@foo.com'; 
  const password = 'register123'; 
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
