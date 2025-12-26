# 2IOT
## Setup
1. Clone this project to local machine
```shell
  git clone https://github.com/BuiXuanSon1412/2IOT.git
```
2. Frontend setup
```shell
  cd frontend/
  npm install
```

Run Frontend:
```shell
  npm run dev
```

3.Backend setup <br/>
Open another terminal, run InfluxDB and Redis:
```shell
  cd backend/
  docker compose down -v
  docker compose up
```

Open another terminal, run the server:
```shell
  cd backend/
  npm install
  npm run server
```