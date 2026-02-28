import { expect, test } from '@playwright/test';

test('register login create note assign to project and search', async ({ page }) => {
  let token = '';
  const notes: Array<any> = [];
  const projects: Array<any> = [];

  await page.route('**/auth/refresh', async (route) => {
    if (!token) {
      await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Unauthorized' }) });
      return;
    }

    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ access_token: token }) });
  });

  await page.route('**/auth/register', async (route) => {
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 'user-1' }) });
  });

  await page.route('**/auth/login', async (route) => {
    token = 'access-token';
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'set-cookie': 'refreshToken=fake; Path=/auth;' },
      body: JSON.stringify({
        access_token: token,
        user: {
          id: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'USER',
        },
      }),
    });
  });

  await page.route('**/projects', async (route) => {
    if (route.request().method() === 'POST') {
      const payload = JSON.parse(route.request().postData() || '{}');
      const project = {
        id: `project-${projects.length + 1}`,
        name: payload.name,
        notesCount: 0,
        createdAt: new Date().toISOString(),
      };
      projects.push(project);
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(project) });
      return;
    }

    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(projects) });
  });

  await page.route('**/projects/*', async (route) => {
    const projectId = route.request().url().split('/').pop() as string;
    const project = projects.find((item) => item.id === projectId);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: projectId,
        name: project?.name || 'Project',
        notes: notes.filter((note) => note.projectId === projectId),
      }),
    });
  });

  await page.route('**/notes', async (route) => {
    if (route.request().method() === 'POST') {
      const payload = JSON.parse(route.request().postData() || '{}');
      const note = {
        id: `note-${notes.length + 1}`,
        text: payload.text,
        summary: payload.text,
        translation: payload.text,
        createdAt: new Date().toISOString(),
      };
      notes.push(note);
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(note) });
      return;
    }

    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(notes) });
  });

  await page.route('**/notes/*/project', async (route) => {
    const segments = route.request().url().split('/');
    const noteId = segments[segments.length - 2];
    const payload = JSON.parse(route.request().postData() || '{}');
    const note = notes.find((item) => item.id === noteId);
    if (note) {
      note.projectId = payload.projectId;
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(note || {}) });
  });

  await page.goto('/register');
  await page.getByPlaceholder('First name').fill('John');
  await page.getByPlaceholder('Last name').fill('Doe');
  await page.getByPlaceholder('Email').fill('john@example.com');
  await page.getByPlaceholder('Password').fill('password123');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page.getByText('Recent notes')).toBeVisible();

  await page.goto('/projects');
  await page.getByPlaceholder('Create a project name').fill('Client Calls');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: 'Open' }).click();

  await page.getByPlaceholder('Write a note...').fill('Critical customer insight');
  await page.getByRole('button', { name: 'Add note' }).click();

  await page.goto('/dashboard');
  await page.getByRole('textbox').fill('critical');

  await expect(page.getByText('Critical customer insight')).toBeVisible();
});
