
# Backend - Game Reviews App

Este é o backend da aplicação Game Reviews, desenvolvido com Spring Boot.

## Pré-requisitos

- Java 17 ou superior
- Maven 3.6 ou superior
- Banco de dados (MySQL/PostgreSQL) - opcional, pode usar H2 em memória

## Configuração

1. Clone o repositório
2. Navegue até a pasta backend:
Configure o banco de dados (opcional):
-Edite o arquivo src/main/resources/application.properties
-Configure as propriedades de conexão com o banco
3. Como executar:

Usando Maven
# Instalar dependências
mvn clean install

# Executar a aplicação
mvn spring-boot:run

Usando JAR
# Gerar o JAR
mvn clean package

# Executar o JAR
java -jar target/game-reviews-app-0.0.1-SNAPSHOT.jar

### Endpoints da API
A aplicação será executada em http://localhost:8080

Swagger UI: http://localhost:8080/swagger-ui.html (se configurado)
API Base: http://localhost:8080/api

### Estrutura do Projeto
src/
├── main/
│   ├── java/
│   │   └── com/gamereviews/
│   │       ├── controller/     # Controllers REST
│   │       ├── service/        # Lógica de negócio
│   │       ├── repository/     # Acesso a dados
│   │       ├── model/          # Entidades
│   │       └── config/         # Configurações
│   └── resources/
│       ├── application.properties
│       └── static/
└── test/
