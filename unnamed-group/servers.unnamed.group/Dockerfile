FROM denoland/deno:alpine-2.9.4
WORKDIR /app
COPY source/ .
EXPOSE 80
EXPOSE 13337/udp
CMD ["deno", "--allow-all", "main.js"]