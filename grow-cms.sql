-- Creazione del tipo ENUM per lo stato dei post
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
-- Creazione del tipo ENUM
CREATE TYPE taxonomy_type AS ENUM ('category', 'tag');

CREATE SEQUENCE IF NOT EXISTS users_id_seq;
CREATE SEQUENCE IF NOT EXISTS taxonomy_id_seq;
CREATE SEQUENCE IF NOT EXISTS post_id_seq;
CREATE SEQUENCE IF NOT EXISTS page_id_seq;
CREATE SEQUENCE IF NOT EXISTS media_id_seq;
CREATE SEQUENCE IF NOT EXISTS content_taxonomy_id_seq;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(500) NOT NULL,
  surname varchar(500) NOT NULL,
  email varchar(500) UNIQUE,
  password varchar(500),
  lastLogin TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Creazione della tabella taxonomy
CREATE TABLE taxonomy (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    type taxonomy_type NOT NULL,
    parent_id INT REFERENCES taxonomy(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creazione della tabella dei post
CREATE TABLE post (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    url VARCHAR(255),
    description VARCHAR(255),
    status post_status DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS page (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content TEXT,
  url VARCHAR(255),
  description VARCHAR(255) NOT NULL,
  status post_status DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS content_taxonomy (
  id SERIAL PRIMARY KEY,
  content_id INTEGER,
  taxonomy_id INTEGER
);

CREATE TABLE IF NOT EXISTS media (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id uuid,
  file_name varchar(255),
  file_path varchar(255),
  file_type varchar(50),
  size integer,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  content_id INTEGER
);

ALTER TABLE media ADD CONSTRAINT media_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE content_taxonomy ADD CONSTRAINT content_taxonomy_content_id_fk FOREIGN KEY (content_id) REFERENCES post (id);
ALTER TABLE content_taxonomy ADD CONSTRAINT content_taxonomy_taxonomy_id_fk FOREIGN KEY (taxonomy_id) REFERENCES taxonomy (id);
ALTER TABLE media ADD CONSTRAINT media_content_id_fk FOREIGN KEY (content_id) REFERENCES post (id);