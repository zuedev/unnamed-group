$ROOT = "/docker-compose/174bg-website/"

ssh "root@docker-compose" "cd $ROOT && docker compose up -d --build --remove-orphans"