FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# this is necessary in prisma
RUN apt-get update -y && apt-get install -y openssl

RUN corepack enable
COPY . /app
WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
EXPOSE 8080
CMD [ "pnpm", "start" ]
