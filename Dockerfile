FROM python:3

RUN mkdir tabletop
COPY . /tabletop

RUN pip3 install --upgrade pip && \
    pip3 install --no-cache-dir -r tabletop/requirements.txt

RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get update && apt-get install -y nodejs
RUN cd /tabletop/frontend && npm install
RUN cd /tabletop/frontend && npm run build