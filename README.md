# KanBan (Task Manager)

Kanban is a simple task manager that allows you to create tasks and drag-and-drop them between columns (To Do | In Progress | Done). It also includes features for editing and deleting tasks.

## Table of Contents

- [Getting Started](#getting-started)
- [Setup Environment Variables](#setup-environment-variables)
- [For MySQL](#for-mysql)
- [Development Mode](#development-mode)
- [Production Mode](#production-mode)


## Getting Started

### Clone the repository

**SSH**:
```bash
git clone git@github.com:oroshi80/task_manager.git
```
**HTTP**:
```bash
git clone https://github.com/oroshi80/task_manager.git
```

## Setup Environment Variables
create a `.env` file and add the following variables:
```bash
DATABASE="mongoDB" # Choose database: MySQL || mongoDB 

# MySQL
MYSQL_HOST=""
MYSQL_USER=""
MYSQL_PASS=""
MYSQL_DB="kanban"

# MongoDB
MONGODB_URI = "<MONGODB_DB_URL>"
MONGODB_DB="kanbanDB"
```
## For MySQL

If you're using MySQL, create the following table:
```sql 
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('to-do','in-progress','done') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Development Mode
```bash 
npm run dev
```

## Production Mode 
```bash 
npm run start
```
# Questions or Issues?

Please report any issues on the [GitHub Issues page](https://github.com/oroshi80/task_manager/issues).

