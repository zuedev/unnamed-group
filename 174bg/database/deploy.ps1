$ROOT = "/docker-compose/db.174bg.net/"

scp ".\volumes\pocketbase\pb_hooks\main.pb.js" "root@docker-compose:$ROOT/volumes/pocketbase/pb_hooks/main.pb.js"

scp ".\docker-compose.yaml" "root@docker-compose:$ROOT/docker-compose.yaml"

ssh "root@docker-compose" "cd $ROOT && docker compose up -d --build --remove-orphans"