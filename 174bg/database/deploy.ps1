$ROOT = "/docker-compose/db.174bg.net/"

ssh "root@docker-compose" "cd $ROOT && docker compose down && rm -rf ./volumes/pocketbase/pb_hooks/*"

scp -r ".\volumes\pocketbase\pb_hooks\" "root@docker-compose:$ROOT/volumes/pocketbase/"

scp ".\docker-compose.yaml" "root@docker-compose:$ROOT/docker-compose.yaml"

ssh "root@docker-compose" "cd $ROOT && docker compose up -d --build --remove-orphans"