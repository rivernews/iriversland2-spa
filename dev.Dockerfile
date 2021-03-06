# pull official base image
# debian
# FROM python:3.7-slim
# alpine
FROM node:14.15.3-alpine3.12

# set environment varibles
ENV PROJECT_DIR /usr/src

RUN mkdir -p $PROJECT_DIR
WORKDIR $PROJECT_DIR

# Use volume mount instead of copy
# COPY . .

# prepare db adapter dev env (psycopg2)
# alpine version
RUN apk update \
    && apk add --virtual build-deps gcc python3-dev musl-dev \
    # for cryptography required by `rest-social-auth`
    # https://stackoverflow.com/a/63836279/9814131
    && apk add libffi-dev openssl-dev \
    && apk add zsh git

# install dependencies
COPY ./package.json /usr/src/package.json
RUN npm i
# cleanup db adapter installation artifacts
RUN apk del build-deps


# install terminal utilities
RUN sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" && \
    zsh -c 'source ~/.zshrc && git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting && git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions' && \
    zsh -c 'source ~/.zshrc && printf "\n\nplugins=(git zsh-syntax-highlighting zsh-autosuggestions)\n\nsource \$ZSH/oh-my-zsh.sh\n\n" >> ~/.zshrc '
