import { expect } from "chai";

const base_url = 'http://localhost:3001/';

// Test suite for getting tasks
describe('GET Tasks', () => {
  // Test case to verify that all tasks are retrieved successfully
  it('should get all tasks', async () => {
    const response = await fetch('http://localhost:3001');
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data).to.be.an('array').that.is.not.empty;
    expect(data[0]).to.include.all.keys('id', 'description');
  });
});

// Test suite for creating tasks
describe('POST task', () => {
  // Test case to verify that a new task is created successfully
  it('should post a task', async () => {
    const response = await fetch(base_url + 'create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'description': 'Task from unit test' })
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('id');
  });

  // Negative tests
  it('should not post a task without description', async () => {
    const response = await fetch(base_url + 'create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'description': null })
    });

    const data = await response.json();
    expect(response.status).to.equal(400); // Ожидаем статус 400
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('error');
  });
});

// Test suite for deleting tasks
describe('DELETE task', () => {
  // Test case to verify that a task is deleted successfully
  it('should delete a task', async () => {
    const response = await fetch(base_url + 'delete/1', {
      method: 'delete'
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('id');
  });

  // Negative test for deleting a task with invalid ID
  it('should not delete a task with SQL injection', async () => {
  const response = await fetch(base_url + 'delete/invalid_id', {
    method: 'delete'
  });
  
  const data = await response.json();
  expect(response.status).to.equal(500); 
  expect(data).to.be.an('object');
  expect(data).to.include.all.keys('error');
});
});
