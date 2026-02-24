# Usage Examples

## Form System

### Basic Form with Validation

```tsx
'use client';

import { useZodForm } from '@/hooks/useZodForm';
import { Form, Input, Select, Textarea, Checkbox } from '@/components/ui/Form';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  role: z.enum(['user', 'admin']),
  bio: z.string().max(500).optional(),
  terms: z.boolean().refine((val) => val === true, 'You must accept terms'),
});

export default function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: formSchema,
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('name')}
        label="Name"
        error={errors.name?.message}
        required
      />
      <Input
        {...register('email')}
        type="email"
        label="Email"
        error={errors.email?.message}
        required
      />
      <Select
        {...register('role')}
        label="Role"
        options={[
          { value: 'user', label: 'User' },
          { value: 'admin', label: 'Admin' },
        ]}
        error={errors.role?.message}
      />
      <Textarea
        {...register('bio')}
        label="Bio"
        hint="Max 500 characters"
        error={errors.bio?.message}
      />
      <Checkbox
        {...register('terms')}
        label="I accept the terms and conditions"
        error={errors.terms?.message}
      />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Data Fetching with TanStack Query

```tsx
'use client';

import { useUsers, useCreateUser, useDeleteUser } from '@/hooks/useUsers';
import { useNotification } from '@/hooks/useNotification';

export default function UsersList() {
  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const notification = useNotification();

  const handleCreate = async () => {
    try {
      await createUser.mutateAsync({
        name: 'John Doe',
        email: 'john@example.com',
      });
      notification.success('User created successfully!');
    } catch (error) {
      notification.error('Failed to create user');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser.mutateAsync(id);
      notification.success('User deleted');
    } catch (error) {
      notification.error('Failed to delete user');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div>
      <button onClick={handleCreate}>Add User</button>
      {users?.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Modal & Confirm Dialog

```tsx
'use client';

import { useModal } from '@/hooks/useModal';
import { useConfirm } from '@/hooks/useConfirm';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function Example() {
  const modal = useModal();
  const confirm = useConfirm();

  const handleDelete = () => {
    confirm.confirm(
      async () => {
        // Delete logic
        console.log('Deleted!');
      },
      {
        title: 'Delete User',
        description: 'Are you sure? This action cannot be undone.',
        confirmText: 'Delete',
        variant: 'danger',
      }
    );
  };

  return (
    <>
      <button onClick={modal.open}>Open Modal</button>
      <button onClick={handleDelete}>Delete</button>

      <Modal
        open={modal.isOpen}
        onOpenChange={modal.close}
        title="My Modal"
        description="This is a modal dialog"
      >
        <p>Modal content goes here</p>
        <button onClick={modal.close}>Close</button>
      </Modal>

      {confirm.onConfirmAction && (
        <ConfirmDialog
          open={confirm.isOpen}
          onOpenChange={confirm.close}
          onConfirm={confirm.onConfirmAction}
          {...confirm.options}
        />
      )}
    </>
  );
}
```

## Table & Pagination

```tsx
'use client';

import Table, { Column } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersTable({ users }: { users: User[] }) {
  const pagination = usePagination({
    totalItems: users.length,
    itemsPerPage: 10,
  });

  const columns: Column<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <button onClick={() => console.log('Edit', user.id)}>Edit</button>
      ),
    },
  ];

  const paginatedData = pagination.paginateData(users);

  return (
    <>
      <Table
        data={paginatedData}
        columns={columns}
        onRowClick={(user) => console.log('Clicked', user)}
      />
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
        pageSize={pagination.pageSize}
        totalItems={users.length}
      />
    </>
  );
}
```

## Search with Debounce

```tsx
'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import SearchInput from '@/components/ui/SearchInput';

export default function SearchExample() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  // Use debouncedSearch for API calls
  // This will only trigger after user stops typing for 500ms

  return (
    <SearchInput
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onClear={() => setSearch('')}
      placeholder="Search..."
    />
  );
}
```

## Date & Number Formatting

```tsx
import {
  formatDate,
  formatRelativeTime,
  formatCurrency,
  formatFileSize,
  formatCompactNumber,
} from '@/lib/format';

// Date formatting
formatDate('2024-01-15', 'PP', 'de'); // => '15. Jan. 2024'
formatRelativeTime('2024-01-15T10:00:00Z'); // => '2 hours ago'

// Number formatting
formatCurrency(1234.56, 'EUR', 'de'); // => '1.234,56 €'
formatFileSize(1536); // => '1.5 KB'
formatCompactNumber(1234567); // => '1.2M'
```

## MongoDB Query Filter

```tsx
import { createFilterBuilder } from '@/lib/query-filter';
import User from '@/models/User';

// Build complex MongoDB queries
const filter = createFilterBuilder<User>()
  .equals('isActive', true)
  .search('name', 'John')
  .in('role', ['admin', 'editor'])
  .greaterThan('createdAt', new Date('2024-01-01'))
  .build();

const users = await User.find(filter);
```

## Common Validation Schemas

```tsx
import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  urlSchema,
  slugSchema,
} from '@/schemas/common.schema';

// Use in your forms
const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema.optional(),
  website: urlSchema.optional(),
  username: slugSchema,
});
```

## Protected Routes

```tsx
'use client';

import { withAuth } from '@/components/hoc/withAuth';

function DashboardPage() {
  return <div>Protected Dashboard</div>;
}

// Protect the entire page
export default withAuth(DashboardPage);

// Or with role requirement
// export default withAuth(DashboardPage, { requiredRole: 'admin' });
```

## Permissions

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';

export default function Example() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  return (
    <>
      {hasPermission('user:write') && <button>Edit User</button>}
      {hasPermission('user:delete') && <button>Delete User</button>}
    </>
  );
}
```

## Notifications

```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';

export default function Example() {
  const notification = useNotification();

  const handleSave = async () => {
    notification.promise(saveData(), {
      loading: 'Saving...',
      success: 'Saved successfully!',
      error: 'Failed to save',
    });
  };

  return (
    <div>
      <button onClick={() => notification.success('Success!')}>Success</button>
      <button onClick={() => notification.error('Error!')}>Error</button>
      <button onClick={() => notification.warning('Warning!')}>Warning</button>
      <button onClick={() => notification.info('Info!')}>Info</button>
      <button onClick={handleSave}>Save with Promise</button>
    </div>
  );
}
```
