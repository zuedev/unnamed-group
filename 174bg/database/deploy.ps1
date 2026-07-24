$ROOT = "/docker-compose/db.174bg.net/";

scp ".\volumes\pocketbase\pb_hooks\main.pb.js" "root@docker-compose:$ROOT/volumes/pocketbase/pb_hooks/main.pb.js"