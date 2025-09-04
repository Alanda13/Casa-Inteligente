# Controle de Domótica

**Instituto Federal do Piauí**  
Curso de Superior de Tecnologia em Análise e Desenvolvimento de Sistemas  
Disciplina: Programação para Internet II – Prof. Rogério Silva  
Turma: ADS IV – 2025.2  

**Integrantes:** Alanda Amábily, Izadora Pamella, Rafael Silva  

---

## 1. Descrição do Projeto

O projeto **“Controle de Domótica”** tem como objetivo avaliar o nível de conhecimento técnico dos alunos em desenvolvimento para internet, capacidade de organização da equipe e gestão de recursos em projetos com prazos curtos, além da tomada de decisão.

O sistema consiste em uma aplicação web que simula o controle de dispositivos de uma **casa inteligente**, permitindo:

- Gerenciar **Cômodos** (ex.: Sala de Estar, Cozinha, Quarto);
- Controlar **Dispositivos** dentro de cada cômodo (ex.: lâmpadas, ventiladores, tomadas inteligentes);
- Criar e executar **Cenas**: sequências de ações pré-definidas com intervalos entre elas (ex.: "Chegar em Casa", "Modo Cinema").

O sistema deve oferecer um **CRUD completo** para todas as entidades e permitir a comunicação futura com dispositivos físicos.

---

## 2. Objetivos

- Diagnosticar habilidades em **Engenharia de Software**, **Backend** e **Frontend**;
- Avaliar capacidade de **organização e trabalho em equipe**;
- Desenvolver um sistema web funcional que simule a automação de uma casa inteligente;
- Registrar decisões, diagramas e documentação para análise do professor.

---

## 3. Tecnologias Utilizadas

- **Backend:** Node.js / Express 
- **Banco de Dados:** PostgreSQL  
- **Frontend:** HTML, CSS, JavaScript  
- **Comunicação:** API REST  

---

## 4. Funcionalidades

- **Cômodos:** criar, listar, atualizar e excluir cômodos da casa.  
- **Dispositivos:** criar, listar, atualizar, excluir e alternar estado (Ligado/Desligado).  
- **Cenas:** criar, listar, atualizar, excluir e ativar/desativar cenas com intervalos de execução.  

---
## 5. Artefatos de Projeto

Antes da codificação, os seguintes artefatos foram elaborados:

1. **Lista de Casos de Uso:** principais interações do usuário com o sistema (ex.: ligar/desligar dispositivos).  
2. **Diagrama de Caso de Uso:** representação gráfica das interações e atores.  
3. **Diagrama de Classes:** modelagem das entidades Dispositivo, Cômodo e Cena, com atributos e métodos.  
4. **Diagrama Entidade-Relacionamento (DER):** modelagem das tabelas do banco de dados e suas relações.  
5. **Documentação de API:** descrição de endpoints com métodos, URLs, parâmetros, corpo de requisição, respostas e status codes.  

> **Espaço para adicionar a documentação completa do Google Docs:**  
> [Clique aqui para acessar a documentação](https://docs.google.com/document/d/1c0upFQi8ypnUcEGOuMw-LFuwzmbFnocf3uKl4xb4-eg/edit?tab=t.0)  

## 6. Estrutura de Entidades

- **Cômodo:** representa um ambiente da casa.  
- **Dispositivo:** representa objetos controláveis (lâmpadas, ventiladores).  
- **Cena:** sequência de ações em dispositivos, com intervalos e ativação/desativação.  

---

## 7. Requisitos

- **Backend:** API REST com endpoints para CRUD completo de todas as entidades.  
- **Frontend:** aplicação web consumindo a API.  
- **Banco de Dados:** persistência de dados usando PostgreSQL.  
- **Deploy:** opcional, se possível pelos membros da equipe.  

---
