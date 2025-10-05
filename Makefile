.PHONY: build up down logs sh dbsh

build: ; docker compose build
up:    ; docker compose up -d
down:  ; docker compose down
logs:  ; docker compose logs -f --tail=120
sh:    ; docker exec -it harmonyhub sh
dbsh:  ; docker exec -it harmonyhub_db psql -U $$POSTGRES_USER -d $$POSTGRES_DB
