# Build
FROM oven/bun:1 AS build
WORKDIR /src
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Run: static files on unprivileged nginx (port 8080, uid 101), so it works
# with a read-only rootfs and no capabilities.
FROM nginxinc/nginx-unprivileged:alpine
LABEL org.opencontainers.image.source=https://github.com/xavidiaz/FreetidsbankenApp
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 8080
