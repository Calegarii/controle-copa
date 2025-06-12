-- Script para criar o banco de dados do Controle de Copa
CREATE DATABASE IF NOT EXISTS copa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE copa;

CREATE TABLE IF NOT EXISTS colaboradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  codigo_qr VARCHAR(50) UNIQUE NOT NULL,
  empresa VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS registros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  colaborador_id INT NOT NULL,
  data_entrada DATETIME NOT NULL,
  data_saida DATETIME DEFAULT NULL,
  FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id)
    ON DELETE CASCADE
);