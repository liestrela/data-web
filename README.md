# Calendário de Revisões

Aplicação de página única (SPA) de um calendário de revisões feito com React.

## Rodando

Primeiro, garanta que possui o Docker Compose instalado. Crie um arquivo .env baseado no .env.example.

```bash
cp .env.example .env
nano .env
```

E então inicie o docker:

```bash
docker compose up
```

O docker iniciará com quatro containers:

- Banco de dados postgresql
- Servidor minio para imagens
- Servidor bun de backend com express
- Servidor bun de frontend bun com reactjs